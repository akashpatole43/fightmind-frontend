import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-dojo-dark)] font-sans flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Main scrollable view */}
        <main className="flex-1 overflow-y-auto relative h-[calc(100vh-4rem)]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
