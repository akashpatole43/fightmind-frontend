import { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  User,
  LogOut,
  ShieldAlert,
  BarChart3, 
  Users 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on click outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dojo Chat', path: '/chat', icon: MessageSquare },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'All Students', path: '/admin/users', icon: Users },
    { name: 'Dojo Stats', path: '/admin/stats', icon: BarChart3 },
  ];

  const NavItem = ({ name, path, icon: Icon }: any) => (
    <NavLink
      to={path}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-[var(--color-neon-red)]/10 text-[var(--color-neon-red)] border border-[var(--color-neon-red)]/30 shadow-[0_0_15px_rgba(255,51,102,0.15)]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{name}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 flex flex-col glass-panel border-r border-[var(--color-dojo-border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-[var(--color-dojo-border)]">
          <div className="text-2xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            Fight<span className="text-[var(--color-neon-red)] drop-shadow-[0_0_12px_rgba(255,51,102,0.6)]">Mind</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Training
          </div>
          {navLinks.map((link) => (
            <NavItem key={link.path} {...link} />
          ))}

          {/* Admin Section */}
          {user?.role === 'ROLE_ADMIN' && (
            <>
              <div className="text-xs font-bold text-[var(--color-neon-gold)] uppercase tracking-wider mt-6 mb-2 px-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Dojo Admin
              </div>
              {adminLinks.map((link) => (
                <NavItem key={link.path} {...link} />
              ))}
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[var(--color-dojo-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[var(--color-neon-red)] hover:bg-[var(--color-neon-red)]/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Leave Dojo</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
