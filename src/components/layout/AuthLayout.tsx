import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Common Layout applied only to the Login and Registration screens.
 * Uses a gorgeous dark gym theme background with deep shadows to emphasize
 * the glassmorphism card floating in the center.
 */
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* Background Layer: Deep dark abstract gym / cage aesthetic */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-[#0f0f11]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11] via-transparent to-[#0f0f11]" />
      </div>

      {/* Glowing Neon Accent Blob */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--color-neon-red)] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--color-neon-gold)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      {/* Floating Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl mx-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-neon-red)] to-transparent opacity-70" />
        <Outlet />
      </motion.div>
    </div>
  );
};
