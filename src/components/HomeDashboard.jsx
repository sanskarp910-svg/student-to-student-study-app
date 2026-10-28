import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeDashboard({ 
  user, 
  doubts = [], 
  notes = [], 
  groups = [], 
  onSelectTab, 
  onOpenDoubt, 
  onSelectSubject, 
  onPreviewNote, 
  onDownloadNote 
}) {
  const navigate = useNavigate();
  const safeUser = user || {
    name: "Student",
    college: "University Campus",
    course: "Engineering",
    semester: "Semester 1",
    subjects: ["Maths", "C Programming", "Physics"]
  };

  const safeSubjects = Array.isArray(safeUser.subjects) && safeUser.subjects.length > 0
    ? safeUser.subjects
    : ["Maths", "C Programming", "Data Structures", "Physics"];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-cream-50 p-6 sm:p-8 shadow-card border border-navy-700">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-20 -mb-10 w-48 h-48 bg-orange-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              {safeUser.college} • {safeUser.semester}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-cream-50 tracking-tight">
              Hey {safeUser.name}! Ready to learn or share today?
            </h1>
            <p className="text-sm sm:text-base text-cream-300 mt-2 font-normal leading-relaxed">
              Connect with course seniors, clear engineering doubts, access verified handwritten unit notes, or join upcoming exam study circles.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button 
                onClick={() => navigate('/ask')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Ask a Doubt</span>
              </button>

              <button 
                onClick={() => navigate('/notes')}
                className="bg-cream-100 hover:bg-white text-navy-900 font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Notes Library</span>
              </button>

              <button 
                onClick={() => navigate('/groups')}
                className="bg-navy-800/80 hover:bg-navy-700 text-cream-100 font-semibold text-sm px-4 py-2.5 rounded-xl border border-navy-600 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>Study Groups</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-navy-900/80 p-3.5 rounded-xl border border-navy-700 backdrop-blur-sm">
              <span className="text-teal-400 font-bold text-2xl tracking-tight">{doubts.length}</span>
              <p className="text-xs text-cream-300 font-medium">Active Doubts</p>
            </div>
            <div className="bg-navy-900/80 p-3.5 rounded-xl border border-navy-700 backdrop-blur-sm">
              <span className="text-orange-400 font-bold text-2xl tracking-tight">
                {doubts.reduce((acc, d) => acc + (d.answers ? d.answers.length : 0), 0)}
              </span>
              <p className="text-xs text-cream-300 font-medium">Peer Answers</p>
            </div>
            <div className="bg-navy-900/80 p-3.5 rounded-xl border border-navy-700 backdrop-blur-sm">
              <span className="text-teal-300 font-bold text-2xl tracking-tight">{notes.length}</span>
              <p className="text-xs text-cream-300 font-medium">Verified Notes</p>
            </div>
            <div className="bg-navy-900/80 p-3.5 rounded-xl border border-navy-700 backdrop-blur-sm">
              <span className="text-orange-300 font-bold text-2xl tracking-tight">{groups.length}</span>
              <p className="text-xs text-cream-300 font-medium">Study Circles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Course Subject Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span>Browse by Your Subjects</span>
          </h2>
          <span className="text-xs text-navy-500 font-medium">{safeUser.course}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {safeSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                navigate('/doubts');
                if (onSelectSubject) onSelectSubject(sub);
              }}
              className="flex-shrink-0 bg-cream-100 hover:bg-teal-50 hover:border-teal-400 text-navy-800 text-xs font-semibold px-3.5 py-2 rounded-xl border border-cream-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              <span>{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Dashboard Feed: Recent Doubts & Popular Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Doubts Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-navy-900 tracking-tight">Recent Doubts Feed</h2>
            </div>
            <button 
              onClick={() => navigate('/doubts')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              <span>View All ({doubts.length})</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {doubts.slice(0, 3).map((doubt) => {
              const answersCount = Array.isArray(doubt.answers) ? doubt.answers.length : 0;
              const hasBestAnswer = doubt.bestAnswerFlag || doubt.best_answer_flag;

              return (
                <div 
                  key={doubt.id}
                  onClick={() => navigate(`/doubts/${doubt.id}`)}
                  className="bg-cream-100 hover:bg-white rounded-2xl p-5 border border-cream-200 hover:border-teal-400 transition-all shadow-soft hover:shadow-card cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                        {doubt.subject}
                      </span>
                      <span className="text-xs text-navy-500 font-medium">
                        {doubt.semester}
                      </span>
                      {hasBestAnswer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          <span>★</span> Best Answer Found
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-navy-400 flex-shrink-0">{doubt.createdAt || "Recent"}</span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-base group-hover:text-teal-700 transition-colors leading-snug">
                    {doubt.title}
                  </h3>

                  <p className="text-xs text-navy-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                    {doubt.questionText || doubt.question_text}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-200 text-xs text-navy-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-800">{doubt.authorName || doubt.author_name || "Student"}</span>
                      <span className="text-navy-400">•</span>
                      <span className="text-navy-400 font-mono text-[11px]">{doubt.authorUid || doubt.author_uid || "STD"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-teal-700 font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        {answersCount} {answersCount === 1 ? 'Answer' : 'Answers'}
                      </span>
                      <span className="text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Discuss & Answer →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Popular Notes Repository Spotlight (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-navy-900 tracking-tight">Popular Notes</h2>
            </div>
            <button 
              onClick={() => navigate('/notes')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              <span>All Notes ({notes.length})</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3">
            {notes.slice(0, 3).map((note) => {
              const ratingValue = Number(note.rating || 4.9).toFixed(1);
              const downloadsCount = note.downloads || note.downloads_count || 0;
              const uploader = note.uploaderName || note.uploader_name || "Peer Contributor";

              return (
                <div 
                  key={note.id}
                  className="bg-cream-100 hover:bg-white rounded-2xl p-4 border border-cream-200 transition-all shadow-soft hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-navy-800 text-cream-100 text-[11px] font-bold rounded-md">
                          {note.subject}
                        </span>
                        <span className="text-[11px] text-navy-500 font-semibold">{note.semester}</span>
                      </div>
                      <h4 className="font-bold text-navy-900 text-sm leading-snug">{note.title}</h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-orange-500 font-bold text-xs">★ {ratingValue}</span>
                      <span className="text-[10px] text-navy-400 block mt-0.5">{downloadsCount} downloads</span>
                    </div>
                  </div>

                  <p className="text-xs text-navy-600 line-clamp-2 mt-2 leading-relaxed">
                    {note.description || "Course unit study notes and solved exam questions."}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-cream-200 text-xs">
                    <span className="text-navy-500 text-[11px]">By <strong className="text-navy-800 font-semibold">{uploader}</strong></span>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onPreviewNote(note)}
                        className="text-navy-600 hover:text-navy-900 text-xs font-semibold px-2 py-1 rounded-md bg-cream-200 hover:bg-cream-300 transition"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => onDownloadNote(note)}
                        className="text-white text-xs font-bold px-3 py-1 rounded-md bg-teal-600 hover:bg-teal-700 transition flex items-center gap-1"
                      >
                        <span>PDF</span>
                        <span>↓</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Study Groups CTA Card */}
          <div className="bg-gradient-to-br from-teal-700 to-navy-900 text-cream-50 p-5 rounded-2xl shadow-card border border-teal-600/40">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 bg-orange-500 text-white font-bold text-[10px] uppercase rounded-full">
                Collaborate
              </span>
              <span className="text-xs text-teal-200 font-medium">Exam Prep Circles</span>
            </div>
            <h4 className="font-extrabold text-base text-cream-50 leading-tight">
              Need a study buddy for semester finals?
            </h4>
            <p className="text-xs text-cream-200 mt-1.5 leading-relaxed">
              Join open peer study rooms for Calculus, C Programming, or OS Kernel problem solving.
            </p>
            <button 
              onClick={() => navigate('/groups')}
              className="mt-3.5 w-full bg-cream-50 text-navy-900 hover:bg-white font-bold text-xs py-2 rounded-xl transition shadow"
            >
              Explore Study Groups ({groups.length}) →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
