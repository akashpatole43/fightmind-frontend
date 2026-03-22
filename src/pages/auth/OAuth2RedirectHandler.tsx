import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import type { UserProfile } from '../../types/auth';

/**
 * Empty component that silently catches the ?token=xxx redirect from 
 * the Java Spring Boot OAuth2SuccessHandler, locks it into Zustand, and
 * bounces the user seamlessly into the Dojo Chat.
 */
export const OAuth2RedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error("Google authentication failed.");
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // Temporarily store token so Axios interceptor immediately picks it up
      localStorage.setItem('token', token); 
      
      // Fetch the full UserProfile from our backend
      api.get<UserProfile>('/user/profile')
        .then(res => {
          setAuth(res.data, token);
          toast.success(`Google Login successful! Welcome, ${res.data.username}`);
          navigate('/chat', { replace: true });
        })
        .catch(err => {
          console.error("Failed to fetch user profile after OAuth", err);
          toast.error("Failed to finalize Google login.");
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams, setAuth]);

  return (
    <div className="min-h-screen bg-[var(--color-dojo-dark)] text-white flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-[var(--color-neon-red)] mb-4" />
      <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Securing your connection...</p>
    </div>
  );
};
