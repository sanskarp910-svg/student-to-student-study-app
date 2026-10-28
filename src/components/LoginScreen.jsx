import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS, MOCK_USERS } from '../data/mockData';

export default function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUid, setRegUid] = useState(`STD-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCollege, setRegCollege] = useState('Apex Institute of Eng & Technology');
  const [regCourse, setRegCourse] = useState('B.Tech Computer Science & Eng');
  const [regSemester, setRegSemester] = useState('Semester 2');
  const [regSubjects, setRegSubjects] = useState(['Maths', 'C Programming', 'Physics']);

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
      points: 100,
      doubtsCount: 0,
      answersCount: 0
    });
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-1/4 -mt-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 -mb-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-900/30 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Student<span className="text-teal-600">2</span>Student
            </h1>
            <span className="text-[11px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              Study App
            </span>
          </div>
          <p className="text-xs sm:text-sm text-navy-600 max-w-sm mx-auto">
            University Peer-Learning Platform. Please sign in or register to access the Doubt Board, Notes Library, and Study Groups.
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card">
          
          {/* Segmented Mode Switcher */}
          <div className="flex bg-cream-200/90 p-1 rounded-2xl mb-6 border border-cream-300 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-navy-900 text-cream-50 shadow-md'
                  : 'text-navy-600 hover:text-navy-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-navy-600 hover:text-navy-900'
              }`}
            >
              Register Account (+100 pts)
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'login' ? (
            <div className="space-y-4 animate-fadeIn">
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
                    placeholder="e.g. STD-2024-8842 or student@apex.edu"
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
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
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign In to Study Platform →
                </button>
              </form>

              {/* 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-cream-200">
                <span className="text-[11px] font-bold text-navy-500 uppercase tracking-wider block mb-2 text-center">
                  Or One-Click Login as Demo Student:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_USERS.map((usr) => (
                    <button
                      key={usr.uid}
                      type="button"
                      onClick={() => onLogin({ user: usr })}
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
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fadeIn">
              
              {/* Full Name & UID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
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
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    Student UID / Roll No <span className="text-orange-500">*</span>
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
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
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
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    Password <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 chars"
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* College & Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    College Name <span className="text-orange-500">*</span>
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
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    Course / Branch <span className="text-orange-500">*</span>
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

              {/* Semester Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
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
                <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                  Select Your Enrolled Subjects ({regSubjects.length} selected)
                </label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-cream-50 border border-cream-300 rounded-xl">
                  {SUBJECT_OPTIONS.filter(s => s !== "All Subjects").map((sub) => {
                    const isChecked = regSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleToggleSubject(sub)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition flex items-center gap-0.5 ${
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
              <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-orange-900">
                <span className="text-base">🎁</span>
                <span>Welcome Bonus: Receive <strong>+100 Peer Points</strong> to access notes!</span>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
              >
                Register Student & Access Platform →
              </button>

              <p className="text-center text-xs text-navy-600 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Sign In instead
                </button>
              </p>
            </form>
          )}

        </div>

        {/* Feature Highlights Footer */}
        <div className="grid grid-cols-3 gap-2 text-center text-navy-600 text-[11px] pt-2">
          <div className="p-2 bg-cream-100 rounded-xl border border-cream-200">
            <span className="block font-bold text-navy-900">💬 Doubt Board</span>
            <span>Ask & answer peers</span>
          </div>
          <div className="p-2 bg-cream-100 rounded-xl border border-cream-200">
            <span className="block font-bold text-navy-900">📚 Notes Library</span>
            <span>Verified unit notes</span>
          </div>
          <div className="p-2 bg-cream-100 rounded-xl border border-cream-200">
            <span className="block font-bold text-navy-900">👥 Study Circles</span>
            <span>Course group prep</span>
          </div>
        </div>

      </div>
    </div>
  );
}
