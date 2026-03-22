import React from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Activity, Medal } from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest">Fighter <span className="text-[var(--color-neon-red)]">Card</span></h1>
          <p className="text-gray-400 mt-1">Manage your training profile</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-[var(--color-dojo-surface)] hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg transition-colors font-bold text-sm tracking-wider uppercase"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Leave Dojo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-neon-red)]" />
          
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border-2 border-[var(--color-dojo-border)] shadow-xl">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-[#ff2a2a]/10 text-[var(--color-neon-red)] text-xs font-black uppercase tracking-widest rounded-full border border-red-500/20">
                {user.role === 'ROLE_ADMIN' ? 'DOJO MASTER (ADMIN)' : 'FIGHTER (USER)'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Account Creation</label>
              <div className="text-white bg-black/40 px-4 py-3 rounded-lg border border-white/5 disabled font-mono text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Auth Provider</label>
              <div className="text-white bg-black/40 px-4 py-3 rounded-lg border border-white/5 font-mono text-sm flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${user.provider === 'GOOGLE' ? 'bg-blue-500' : 'bg-green-500'}`} />
                {user.provider}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Skill Level</h3>
              <Medal className="w-5 h-5 text-[var(--color-neon-gold)]" />
            </div>
            <div className="text-3xl font-black text-white">{user.skillLevel}</div>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">Keep training with the AI to rank up.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Questions Asked</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{user.messageCount}</div>
            <p className="text-xs text-gray-500 mt-2">Total interactions with FightMind.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
