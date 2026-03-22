import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const data = response.data;
      
      const userProfile = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        skillLevel: 'UNKNOWN',
        provider: 'LOCAL' as const,
        messageCount: 0,
        createdAt: new Date().toISOString()
      };

      // Load user into Zustand & LocalStorage
      setAuth(userProfile, data.token);
      
      toast.success(`Welcome back to the Dojo, ${userProfile.username}!`);
      navigate('/chat');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect entirely to the Spring Boot OAuth2 endpoint.
    // Ensure we drop the '/api' suffix using replace.
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-black mb-2 text-white tracking-widest uppercase">Fight<span className="text-[var(--color-neon-red)]">Mind</span></h1>
      <p className="text-gray-400 mb-8 text-sm font-medium">Log in to consult the AI Coach</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input 
            type="email" 
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--color-dojo-surface)] border border-[var(--color-dojo-border)] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-red)] focus:ring-1 focus:ring-[var(--color-neon-red)] transition-all placeholder-gray-600"
            placeholder="champion@dojo.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
          <input 
            type="password" 
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--color-dojo-surface)] border border-[var(--color-dojo-border)] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-red)] focus:ring-1 focus:ring-[var(--color-neon-red)] transition-all placeholder-gray-600"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full glass-button text-white font-bold rounded-lg px-4 py-3 mt-6 flex items-center justify-center uppercase tracking-widest text-sm hover:scale-[1.02]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Enter the Ring
            </>
          )}
        </button>
      </form>

      <div className="w-full flex items-center justify-center my-6">
        <div className="h-px bg-gray-800 flex-grow" />
        <span className="px-4 text-xs text-gray-500 font-bold uppercase tracking-wider">OR</span>
        <div className="h-px bg-gray-800 flex-grow" />
      </div>

      <button 
        onClick={handleGoogleLogin}
        className="w-full bg-white hover:bg-gray-100 text-black font-semibold rounded-lg px-4 py-3 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <p className="mt-8 text-gray-500 text-sm">
        New to FightMind?{' '}
        <Link to="/register" className="text-[var(--color-neon-red)] hover:text-red-400 font-bold underline decoration-transparent hover:decoration-red-400 transition-all">
          Register Here
        </Link>
      </p>
    </div>
  );
};
