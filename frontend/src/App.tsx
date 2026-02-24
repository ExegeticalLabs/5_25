import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Workout pages
import SetupPage from './pages/workout/SetupPage';
import HomePage from './pages/workout/HomePage';
import LiveLiftingPage from './pages/workout/LiveLiftingPage';
import LiveCardioPage from './pages/workout/LiveCardioPage';
import LiveCorePage from './pages/workout/LiveCorePage';

// History & Progress
import HistoryPage from './pages/history/HistoryPage';
import ProgressPage from './pages/history/ProgressPage';

// Settings
import SettingsPage from './pages/settings/SettingsPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: 14 }}>Loading 5/25...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Theme handler
const ThemeHandler: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const darkMode = currentUser?.preferences?.darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [currentUser?.preferences?.darkMode]);

  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ThemeHandler />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />

        {/* Workout routes */}
        <Route path="/workout/lifting/:type" element={<ProtectedRoute><LiveLiftingPage /></ProtectedRoute>} />
        <Route path="/workout/cardio" element={<ProtectedRoute><LiveCardioPage /></ProtectedRoute>} />
        <Route path="/workout/core" element={<ProtectedRoute><LiveCorePage /></ProtectedRoute>} />

        {/* History & Progress */}
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />

        {/* Settings */}
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
