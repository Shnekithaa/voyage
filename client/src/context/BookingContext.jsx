import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
  // Search params
  searchParams: {
    budget: '',
    duration: '',
    vibe: '',
  },
  // Selected destination
  destination: null,
  vibeMatchPercent: null,
  vibeExplanation: '',
  // Selected hotel & room
  hotel: null,
  selectedRoom: null,
  // Booking dates
  checkIn: '',
  checkOut: '',
  nights: 0,
  guests: { adults: 1, children: 0 },
  // Pricing
  pricing: null,
  // Guest info
  guestInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  // Payment
  clientSecret: null,
  bookingReference: null,
  // UI state
  isLoading: false,
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: action.payload };
    case 'SET_DESTINATION':
      return {
        ...state,
        destination: action.payload.destination,
        vibeMatchPercent: action.payload.vibeMatchPercent,
        vibeExplanation: action.payload.vibeExplanation,
      };
    case 'SET_HOTEL':
      return { ...state, hotel: action.payload };
    case 'SET_ROOM':
      return { ...state, selectedRoom: action.payload };
    case 'SET_DATES':
      return {
        ...state,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        nights: action.payload.nights,
      };
    case 'SET_GUESTS':
      return { ...state, guests: action.payload };
    case 'SET_PRICING':
      return { ...state, pricing: action.payload };
    case 'SET_GUEST_INFO':
      return { ...state, guestInfo: { ...state.guestInfo, ...action.payload } };
    case 'SET_PAYMENT':
      return {
        ...state,
        clientSecret: action.payload.clientSecret,
        bookingReference: action.payload.bookingReference,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

export default BookingContext;