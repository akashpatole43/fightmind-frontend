import { useEffect, useState } from 'react';
import { X, MessageSquare, Calendar } from 'lucide-react';
import api from '../../lib/axios';

interface Message {
  id: number;
  query: string;
  answer: string;
  createdAt: string;
  intent?: string;
  sport?: string;
}

interface UserHistoryModalProps {
  userId: number;
  username: string;
  onClose: () => void;
}

export const UserHistoryModal = ({ userId, username, onClose }: UserHistoryModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}/history?size=50`);
        setMessages(res.data.content || res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-dojo-dark)] border border-[var(--color-dojo-border)] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-dojo-border)] bg-black/40">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-neon-gold)]" />
              Chat Logs: {username}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Viewing the 50 most recent queries</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {isLoading ? (
            <div className="text-center text-gray-400 py-10">Loading conversational history...</div>
          ) : error ? (
            <div className="text-center text-[var(--color-neon-red)] py-10">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">This user has not asked any questions yet.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="glass-panel p-5 rounded-lg border border-[var(--color-dojo-border)]/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-black/50 text-[var(--color-neon-gold)] uppercase tracking-widest border border-gray-800">
                      {msg.intent || 'GENERIC'}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-black/50 text-gray-300 uppercase tracking-widest border border-gray-800">
                      {msg.sport || 'MIXED'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-400 mb-1">USER QUERY</p>
                  <p className="text-white text-lg bg-white/5 p-3 rounded-md border-l-4 border-white/20">"{msg.query}"</p>
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--color-neon-gold)] mb-1">AI RESPONSE</p>
                  <p className="text-gray-300 whitespace-pre-wrap">{msg.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
