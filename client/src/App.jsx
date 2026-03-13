import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import PageTransition from './components/layout/PageTransition';
import LandingPage from './pages/LandingPage';
import DiscoveryPage from './pages/DiscoveryPage';
import DestinationPage from './pages/DestinationPage';
import HotelsPage from './pages/HotelsPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import { useAuth } from './context/AuthContext';
import LoadingOrb from './components/ui/LoadingOrb';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOrb />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen bg-grain relative overflow-x-hidden">
      {/* Fixed navbar sits outside the flow */}
      <Navbar />

      {/* Page content pushed down by navbar height (~72px) + top gap (16px) = 88px */}
      {/* On mobile there's no top navbar, just bottom nav padding */}
      <div
        className="flex flex-col flex-1 min-h-screen"
        style={{ paddingTop: 'clamp(72px, 5.5rem, 88px)' }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <LandingPage />
                </PageTransition>
              }
            />
            <Route
              path="/discover"
              element={
                <PageTransition>
                  <DiscoveryPage />
                </PageTransition>
              }
            />
            <Route
              path="/destination/:destinationId"
              element={
                <PageTransition>
                  <DestinationPage />
                </PageTransition>
              }
            />
            <Route
              path="/hotels/:destinationId"
              element={
                <PageTransition>
                  <HotelsPage />
                </PageTransition>
              }
            />
            <Route
              path="/checkout"
              element={
                <PageTransition>
                  <CheckoutPage />
                </PageTransition>
              }
            />
            <Route
              path="/confirmation"
              element={
                <PageTransition>
                  <ConfirmationPage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <BookingsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

export default App;