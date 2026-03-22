import { Menu, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-[var(--color-dojo-border)] glass-panel sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile only) */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-[var(--color-neon-red)] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Mobile Logo Title */}
        <div className="text-xl font-black tracking-widest uppercase text-white lg:hidden">
          Fight<span className="text-[var(--color-neon-red)]">Mind</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold text-white">{user?.username}</span>
          <span className="text-xs text-[var(--color-neon-gold)] tracking-wider">
            {user?.role === 'ROLE_ADMIN' ? 'DOJO MASTER' : 'STUDENT'}
          </span>
        </div>
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--color-dojo-secondary)] border border-[var(--color-neon-red)]/30 text-[var(--color-neon-red)]">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};
