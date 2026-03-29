import { useEffect, useState } from 'react';
import { ShieldAlert, Users, Database, Image, BarChart3, Activity } from 'lucide-react';
import api from '../../lib/axios';

interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  cachedResponses: number;
  messagesWithImages: number;
}

export const AdminStatsPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8 text-[var(--color-neon-red)]">
        <Activity className="w-8 h-8 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400">
        <ShieldAlert className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>{error}</p>
      </div>
    );
  }

  const cacheHitRate = stats?.totalMessages 
    ? ((stats.cachedResponses / stats.totalMessages) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-[var(--color-neon-red)]" />
        Dojo Statistics
      </h1>
      <p className="text-gray-400 mb-8">System-wide AI usage and caching metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1 z-10">Total Registered Users</p>
          <p className="text-4xl font-bold text-white z-10">{stats?.totalUsers}</p>
        </div>

        {/* Total Messages */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1 z-10">Total AI Messages</p>
          <p className="text-4xl font-bold text-[var(--color-neon-gold)] z-10">{stats?.totalMessages}</p>
        </div>

        {/* Cache Hit Rate */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1 z-10">Redis Cache Hit Rate</p>
          <div className="flex items-end gap-2 z-10">
            <p className="text-4xl font-bold text-green-400">{cacheHitRate}%</p>
            <p className="text-sm text-gray-500 mb-1">({stats?.cachedResponses} queries)</p>
          </div>
        </div>

        {/* Vision Queries */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Image className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1 z-10">Vision AI Invocations</p>
          <p className="text-4xl font-bold text-[var(--color-neon-red)] z-10">{stats?.messagesWithImages}</p>
        </div>
      </div>
    </div>
  );
};
