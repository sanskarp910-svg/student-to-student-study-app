import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-navy-800 z-40 safe-bottom shadow-elevated">
      <div className="grid grid-cols-5 items-center justify-around py-2 px-1">
        
        {/* Home */}
        <Link 
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition ${
            isActive('/') ? 'text-teal-400 font-bold' : 'text-cream-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* Doubts */}
        <Link 
          to="/doubts"
          className={`flex flex-col items-center justify-center py-1 transition ${
            isActive('/doubts') ? 'text-teal-400 font-bold' : 'text-cream-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span className="text-[10px] mt-0.5">Doubts</span>
        </Link>

        {/* Center Prominent CTA: Ask a Doubt */}
        <Link 
          to="/ask"
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/40 border-2 border-navy-900 active:scale-95 transition-transform">
            <span className="text-2xl font-bold leading-none">+</span>
          </div>
          <span className="text-[10px] mt-1 text-orange-400 font-bold">Ask Doubt</span>
        </Link>

        {/* Notes */}
        <Link 
          to="/notes"
          className={`flex flex-col items-center justify-center py-1 transition ${
            isActive('/notes') ? 'text-teal-400 font-bold' : 'text-cream-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span className="text-[10px] mt-0.5">Notes</span>
        </Link>

        {/* Groups */}
        <Link 
          to="/groups"
          className={`flex flex-col items-center justify-center py-1 transition ${
            isActive('/groups') ? 'text-teal-400 font-bold' : 'text-cream-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span className="text-[10px] mt-0.5">Groups</span>
        </Link>

      </div>
    </nav>
  );
}
