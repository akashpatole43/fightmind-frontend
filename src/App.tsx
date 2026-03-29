
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OAuth2RedirectHandler } from './pages/auth/OAuth2RedirectHandler';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { ChatController } from './pages/chat/ChatController';
import { AdminStatsPage } from './pages/admin/AdminStatsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-dojo-border)',
            color: 'white',
          }
        }}
      />
      
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />

        {/* Public Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Invisible Route for Google Login */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* Protected App Routes with Global Layout */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          {/* Main App Screens */}
          <Route path="/chat" element={<ChatController />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
