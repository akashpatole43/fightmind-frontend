import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthLayout } from './components/layout/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OAuth2RedirectHandler } from './pages/auth/OAuth2RedirectHandler';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { useAuthStore } from './store/authStore';

// Temporary placeholder for ChatLayout until Phase 3C & 3D
const PlaceholderAppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[var(--color-dojo-dark)] font-sans">
    <header className="h-16 border-b border-[var(--color-dojo-border)] glass-panel sticky top-0 z-50 flex items-center px-6">
      <div className="text-xl font-black tracking-widest uppercase text-white">Fight<span className="text-[var(--color-neon-red)]">Mind</span></div>
    </header>
    <main>{children}</main>
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Global Toast Notifications (Glassmorphism theme) */}
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

        {/* Protected App Routes */}
        <Route element={
          <ProtectedRoute>
            <PlaceholderAppLayout><ProfilePage /></PlaceholderAppLayout>
          </ProtectedRoute>
        }>
          {/* We will map layout properly in Phase 3C, temporarily aliasing /chat to Profile for testing */}
          <Route path="/chat" element={null} />
          <Route path="/profile" element={null} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
