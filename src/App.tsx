// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/auth/SignupPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioTemplatesPage from './pages/PortfolioTemplatesPage';
import ServicePreviewPage from "./pages/ServicePreviewPage";
import SoftwareProjectsPage from './pages/SoftwareProjectsPage';
import NotesPage from './pages/notes/NotesPage';
import ChatPage from './pages/chat/ChatPage';
import EventsPage from './pages/events/EventsPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import AuthCallback from './pages/auth/AuthCallback';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import HangoutSpotsPage from './pages/hangouts/HangoutSpotsPage';
import CreateHangoutSpotPage from './pages/hangouts/CreateHangoutSpotPage';
import HangoutSpotDetailPage from './pages/hangouts/HangoutSpotDetailPage';
import EventDetailPage from './pages/events/EventDetailPage';
import ScrollToTop from './components/ScrollToTop';
import CreateNotePage from './pages/notes/CreateNotePage';
import NoteDetailPage from './pages/notes/NoteDetailPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  console.log('🛡️ ProtectedRoute - Auth state:', { isAuthenticated, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute - Rendering children');
  return <>{children}</>;
};

function App() {
  const { theme } = useAppStore();
  const { initializeAuth, isAuthenticated, isLoading } = useAuthStore();

  // Initialize auth only once on app mount
  useEffect(() => {
    console.log('🚀 App mounted - Initializing auth');
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Debug auth state
  useEffect(() => {
    console.log('🔐 App - Auth state changed:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio-templates" element={<PortfolioTemplatesPage />} />
          <Route path="/software-projects" element={<SoftwareProjectsPage />} />
          <Route path="/service-preview/:serviceId" element={<ServicePreviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/notes" element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } />

          <Route path="/notes/create" element={
            <ProtectedRoute>
              <CreateNotePage />
            </ProtectedRoute>
          } />

          <Route path="/notes/:noteId" element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/notes/edit/:noteId" element={
            <ProtectedRoute>
              <CreateNotePage />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/events" element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } />

          {/* Events Routes */}
          <Route path="/events" element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          } />

          <Route path="/events/:eventId" element={
            <ProtectedRoute>
              <EventDetailPage />
            </ProtectedRoute>
          } />


          <Route path="/hangouts" element={
            <ProtectedRoute>
              <HangoutSpotsPage />
            </ProtectedRoute>
          } />

          <Route path="/hangouts/create" element={
            <ProtectedRoute>
              <CreateHangoutSpotPage />
            </ProtectedRoute>
          } />

          <Route path="/hangouts/:spotId" element={
            <ProtectedRoute>
              <HangoutSpotDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/hangouts/edit/:spotId" element={
            <ProtectedRoute>
              <CreateHangoutSpotPage />
            </ProtectedRoute>
          } />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page - TODO</div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;