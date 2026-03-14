import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Firebase auth token
API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    console.error(`❌ API Error: ${message}`);
    return Promise.reject(error);
  }
);

// API functions
export const searchVibe = (data) => API.post('/vibe/search', data);
export const getTrending = () => API.get('/vibe/trending');
export const getHotelsByDestination = (destinationId, params) =>
  API.get(`/hotels/destination/${destinationId}`, { params });
export const getHotelDetails = (hotelId) => API.get(`/hotels/${hotelId}`);
export const calculateBooking = (data) => API.post('/bookings/calculate', data);
export const createPaymentIntent = (data) => API.post('/payments/create-intent', data);
export const confirmPayment = (data) => API.post('/payments/confirm', data);
export const getBooking = (reference) => API.get(`/bookings/${reference}`);
export const getUserBookings = () => API.get('/bookings/user');
export const createBooking = (data, config = {}) => API.post('/bookings/create', data, config);

export default API;