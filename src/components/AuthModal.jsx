import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS, MOCK_USERS } from '../data/mockData';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUid, setRegUid] = useState(`STD-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCollege, setRegCollege] = useState('Apex Institute of Eng & Technology');
  const [regCourse, setRegCourse] = useState('B.Tech Computer Science & Eng');
  const [regSemester, setRegSemester] = useState('Semester 2');
  const [regSubjects, setRegSubjects] = useState(['Maths', 'C Programming', 'Physics']);

  if (!isOpen) return null;

  const handleToggleSubject = (sub) => {
    if (regSubjects.includes(sub)) {
      if (regSubjects.length > 1) {
        setRegSubjects(regSubjects.filter(s => s !== sub));
      }
    } else {
      setRegSubjects([...regSubjects, sub]);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin({
      email: loginEmail,
      password: loginPassword
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister({
      name: regName.trim(),
      uid: regUid.trim(),
      email: regEmail.trim(),
      password: regPassword,
      college: regCollege.trim(),
      course: regCourse.trim(),
      semester: regSemester,
      subjects: regSubjects,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=200&q=80`,
      points: 100, // Starter bonus
      doubtsCount: 0,
      answersCount: 0
    });
  };

  const handleQuickDemoLogin = (demoUser) => {
    onLogin({
      user: demoUser
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cream-300 shadow-elevated max-h-[92vh] overflow-y-auto">
        
        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-navy-900 tracking-tight">
                {mode === 'login' ? 'Welcome Back!' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-navy-500">Student to Student Peer Learning Network</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-navy-400 hover:text-navy-900 text-sm font-bold p-1 rounded-lg hover:bg-cream-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-cream-200/80 p-1 rounded-xl mt-4 mb-5 border border-cream-300">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'login' 
                ? 'bg-white text-navy-900 shadow-sm' 
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'register' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            Register Student (+100 pts)
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  University Email or Student UID
                </label>
                <input 
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. aarav.sharma@apex.edu or STD-2024-8842"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-teal-700 hover:underline cursor-pointer">
                    Forgot?
                  </span>
                </div>
                <input 
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md transition hover:-translate-y-0.5"
              >
                Sign In to PeerLearn
              </button>
            </form>

            {/* Quick Demo Student Switcher */}
            <div className="pt-3 border-t border-cream-200">
              <span className="text-[11px] font-bold text-navy-500 uppercase tracking-wider block mb-2 text-center">
                Or Quick Login as Demo Campus Student:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_USERS.map((usr) => (
                  <button
                    key={usr.uid}
                    type="button"
                    onClick={() => handleQuickDemoLogin(usr)}
                    className="flex items-center gap-2 p-2 bg-cream-50 hover:bg-teal-50 hover:border-teal-400 border border-cream-300 rounded-xl transition text-left group"
                  >
                    <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-500" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-navy-900 group-hover:text-teal-800 truncate">{usr.name}</p>
                      <p className="text-[10px] text-navy-500 font-mono truncate">{usr.uid}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-navy-600 pt-1">
              New to campus?{' '}
              <button 
                type="button" 
                onClick={() => setMode('register')} 
                className="text-orange-600 font-bold hover:underline"
              >
                Register your account →
              </button>
            </p>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Full Name & UID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Tanya Verma"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  University UID / Roll No <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={regUid}
                  onChange={(e) => setRegUid(e.target.value)}
                  placeholder="e.g. STD-2025-4412"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  College Email <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@apex.edu"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  Create Password <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="password"
                  required
                  minLength="6"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* College & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  College / Campus <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="Apex Institute of Eng"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                  Course / Major <span className="text-orange-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={regCourse}
                  onChange={(e) => setRegCourse(e.target.value)}
                  placeholder="B.Tech Computer Science"
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Current Semester <span className="text-orange-500">*</span>
              </label>
              <select 
                value={regSemester}
                onChange={(e) => setRegSemester(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {SEMESTER_OPTIONS.filter(s => s !== "All Semesters").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Enrolled Subjects Picker */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Select Your Enrolled Subjects ({regSubjects.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-cream-50 border border-cream-300 rounded-xl">
                {SUBJECT_OPTIONS.filter(s => s !== "All Subjects").map((sub) => {
                  const isChecked = regSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleToggleSubject(sub)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                        isChecked 
                          ? 'bg-teal-600 text-white shadow-sm' 
                          : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Starter Bonus Banner */}
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-orange-900">
              <span className="text-lg">🎁</span>
              <span><strong>Welcome Bonus:</strong> You receive <strong>+100 Peer Points</strong> upon registration to access premium study notes!</span>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
              >
                Complete Registration & Join Campus
              </button>
            </div>

            <p className="text-center text-xs text-navy-600 pt-1">
              Already registered?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')} 
                className="text-teal-700 font-bold hover:underline"
              >
                Sign In instead →
              </button>
            </p>

          </form>
        )}

      </div>
    </div>
  );
}
