import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../types/auth';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/register', { 
        email, 
        username,
        password 
      });
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

      setAuth(userProfile, data.token);
      toast.success(`Registration successful! Welcome, ${userProfile.username}!`);
      navigate('/chat');
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // In Java Backend we built GlobalExceptionHandler which returns { errors: ['email must be valid'] }
      // Or a message: { message: 'Username is already taken' }
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        toast.error(error.response.data.errors[0]); // Show the first validation error
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-black mb-2 text-white tracking-widest uppercase">Start <span className="text-[var(--color-neon-red)]">Training</span></h1>
      <p className="text-gray-400 mb-8 text-sm font-medium">Create your FightMind profile</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
          <input 
            type="text" 
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[var(--color-dojo-surface)] border border-[var(--color-dojo-border)] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-red)] focus:ring-1 focus:ring-[var(--color-neon-red)] transition-all placeholder-gray-600"
            placeholder="thechamp99"
          />
        </div>

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
            autoComplete="new-password"
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
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-gray-500 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--color-neon-red)] hover:text-red-400 font-bold underline decoration-transparent hover:decoration-red-400 transition-all">
          Log In
        </Link>
      </p>
    </div>
  );
};
