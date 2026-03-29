import { useEffect, useState } from 'react';
import { ShieldAlert, Users as UsersIcon, Shield, Trash2, Crosshair, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/axios';
import { UserHistoryModal } from './UserHistoryModal';

interface UserSummary {
  id: number;
  email: string;
  username: string;
  role: string;
  skillLevel: string;
  provider: string;
  joinedAt: string;
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<{id: number, username: string} | null>(null);

  const fetchUsers = async () => {
    try {
      // The Java backend returns a paginated response, we simplify and grab content
      const res = await api.get('/admin/users?size=50');
      setUsers(res.data.content || res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await api.put(`/admin/users/${id}/role?role=${newRole}`);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user completely mapping their chat history?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted out of the dojo permanently');
      fetchUsers();
    } catch (err) {
      toast.error('Could not delete user');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-gray-400">Loading roster...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-400 flex items-center gap-3">
        <ShieldAlert className="w-8 h-8" />
        <span className="font-bold">Access Denied: {error}</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <UsersIcon className="w-8 h-8 text-[var(--color-neon-gold)]" />
        Dojo Roster
      </h1>
      <p className="text-gray-400 mb-8">Manage registered fighters and their access levels.</p>

      <div className="glass-panel overflow-hidden border border-[var(--color-dojo-border)] rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-xs uppercase text-gray-400 border-b border-[var(--color-dojo-border)]">
              <tr>
                <th className="px-6 py-4">Fighter</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Skill / Auth</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dojo-border)]/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--color-dojo-dark)] border border-gray-700 w-fit">
                        <Crosshair className="w-3 h-3" /> {user.skillLevel}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{user.provider} login</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ROLE_ADMIN' ? (
                      <span className="text-[var(--color-neon-red)] flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
                        <Shield className="w-4 h-4" /> Admin
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1 text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedUser({ id: user.id, username: user.username })}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        title="View Chat Logs"
                      >
                        <History className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePromote(user.id, user.role)}
                        className="text-gray-400 hover:text-[var(--color-neon-gold)] transition-colors"
                        title="Toggle Admin status"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Expel from Dojo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserHistoryModal 
          userId={selectedUser.id} 
          username={selectedUser.username} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};
