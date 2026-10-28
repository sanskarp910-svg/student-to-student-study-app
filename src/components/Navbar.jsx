import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeDoubtId, 
  setActiveDoubtId, 
  user, 
  onOpenProfile, 
  onOpenAuth, 
  onLogout, 
  doubtsCount 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-cream-50 border-b border-navy-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => { setCurrentTab('home'); setActiveDoubtId(null); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-900/30 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-cream-50">Student<span className="text-teal-400">2</span>Student</span>
                <span className="text-[10px] bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded-full tracking-wider uppercase">Peer</span>
              </div>
              <p className="text-[11px] text-navy-300 hidden sm:block font-medium">University Peer Learning & Study Exchange</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => { setCurrentTab('home'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'home' && !activeDoubtId ? 'bg-navy-800 text-teal-300 shadow-inner' : 'text-cream-200 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => { setCurrentTab('ask'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'ask' ? 'bg-orange-600 text-white shadow-md' : 'text-orange-400 hover:bg-orange-600/20'
              }`}
            >
              <span className="text-base font-bold leading-none">+</span>
              <span>Ask a Doubt</span>
            </button>

            <button 
              onClick={() => { setCurrentTab('doubts'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'doubts' ? 'bg-navy-800 text-teal-300 shadow-inner' : 'text-cream-200 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <span>Doubt Board</span>
              <span className="text-xs bg-navy-700 text-cream-200 px-1.5 py-0.5 rounded-full">{doubtsCount}</span>
            </button>

            <button 
              onClick={() => { setCurrentTab('notes'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'notes' ? 'bg-navy-800 text-teal-300 shadow-inner' : 'text-cream-200 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <span>Notes Library</span>
            </button>

            <button 
              onClick={() => { setCurrentTab('groups'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'groups' ? 'bg-navy-800 text-teal-300 shadow-inner' : 'text-cream-200 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <span>Study Groups</span>
            </button>

            <button 
              onClick={() => { setCurrentTab('tutors'); setActiveDoubtId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'tutors' ? 'bg-navy-800 text-teal-300 shadow-inner' : 'text-cream-200 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <span>Peer Tutors</span>
            </button>
          </nav>

          {/* User Account / Auth Section */}
          <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-navy-800/90 hover:bg-navy-700/80 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-navy-700 transition"
                  title="Account menu"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-teal-500/50"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-cream-50 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-teal-300 font-mono">{user.uid}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/40">
                    <span>★</span>
                    <span>{user.points || 100} pts</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-navy-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Account Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-cream-100 rounded-2xl shadow-elevated border border-cream-300 py-2 z-50 animate-fadeIn text-navy-900">
                    <div className="px-4 py-2 border-b border-cream-200">
                      <p className="text-xs font-extrabold text-navy-900">{user.name}</p>
                      <p className="text-[11px] text-teal-700 font-mono">{user.uid}</p>
                      <p className="text-[10px] text-navy-500 truncate">{user.college}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setDropdownOpen(false); onOpenProfile(); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                      >
                        <span>👤</span>
                        <span>View Student Profile</span>
                      </button>

                      <button
                        onClick={() => { setDropdownOpen(false); onOpenAuth('register'); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <span>✨</span>
                        <span>Register New Student</span>
                      </button>

                      <button
                        onClick={() => { setDropdownOpen(false); onOpenAuth('login'); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-50 flex items-center gap-2"
                      >
                        <span>🔄</span>
                        <span>Switch Account / Demo</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-cream-200">
                      <button
                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold text-cream-200 hover:text-white px-3 py-1.5 rounded-xl hover:bg-navy-800 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
