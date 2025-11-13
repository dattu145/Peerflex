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
import ResumeTemplatesPage from './pages/ResumeTemplatesPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
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
import ScrollToTop from './components/ScrollToTop';
import CreateNotePage from './pages/notes/CreateNotePage';

// Protected Route Component - MOVED OUTSIDE OF APP COMPONENT
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // This component must directly subscribe to the auth store to re-render properly
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
          <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/portfolio-templates" element={<PortfolioTemplatesPage />} />
          <Route path="/software-projects" element={<SoftwareProjectsPage />} />
          <Route path="/service-preview/:serviceId" element={<ServicePreviewPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
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

          <Route path="/notes/create" element={
            <ProtectedRoute>
              <CreateNotePage />
            </ProtectedRoute>
          } />

          {/* Additional protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page - TODO</div>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;