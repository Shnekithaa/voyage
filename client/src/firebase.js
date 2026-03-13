import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBf_NpuZ0wzlx81as9qktipkPW6rnDzc-8",
  authDomain: "voyage-bf065.firebaseapp.com",
  projectId: "voyage-bf065",
  storageBucket: "voyage-bf065.firebasestorage.app",
  messagingSenderId: "287330692255",
  appId: "1:287330692255:web:a120b62e9df013af3886aa",
  measurementId: "G-SLC1WRX0NZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
