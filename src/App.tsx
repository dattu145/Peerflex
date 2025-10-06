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
import JobsPage from './pages/jobs/JobsPage';
import EventsPage from './pages/events/EventsPage';
import ProjectsPage from './pages/projects/ProjectsPage';


// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/services" element={<ServicesPage />} /> {/* Add this route */}
          <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/portfolio-templates" element={<PortfolioTemplatesPage />} />
          <Route path="/software-projects" element={<SoftwareProjectsPage />} />
          <Route path="/service-preview/:serviceId" element={<ServicePreviewPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Dashboard Coming Soon
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your personalized dashboard is under development.
                    </p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={<AboutPage />}
          />

          {/* Contact Page */}
          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;