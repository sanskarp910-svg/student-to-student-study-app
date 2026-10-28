import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS } from '../data/mockData';

export default function NotesLibrary({ 
  notes, 
  onPreviewNote, 
  onDownloadNote, 
  onOpenUploadModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');

  const filteredNotes = notes.filter(n => {
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || n.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'All Semesters' || n.semester === selectedSemester;
    return matchesSearch && matchesSubject && matchesSemester;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 to-navy-900 text-cream-50 p-6 rounded-2xl shadow-card border border-teal-700/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-700/60 text-teal-200 rounded-full text-xs font-semibold mb-2">
            <span>Verified Notes Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">University Notes Library</h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">Search, preview, and download semester unit notes and exam summaries.</p>
        </div>

        <button 
          onClick={onOpenUploadModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span className="text-base leading-none">↑</span>
          <span>Upload Notes (+20 pts)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-cream-100 p-4 rounded-2xl border border-cream-200 shadow-soft space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input (6 Cols) */}
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              🔍
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by topic (e.g. Maths Unit 1, C Programming, K-Maps)..."
              className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Subject Filter (3 Cols) */}
          <div className="md:col-span-3">
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full py-2.5 px-3 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Semester Filter (3 Cols) */}
          <div className="md:col-span-3">
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full py-2.5 px-3 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>

        {/* Quick Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs">
          <span className="text-navy-500 font-semibold flex-shrink-0 mr-1">Quick Select:</span>
          {["Maths", "C Programming", "Physics", "Data Structures", "Operating Systems"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSubject === sub 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-cream-200/80 text-navy-700 hover:bg-cream-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full bg-cream-100 rounded-2xl p-12 text-center border border-cream-200">
            <span className="text-4xl block mb-2">📚</span>
            <h3 className="font-bold text-navy-900 text-base">No notes found for this subject/semester</h3>
            <p className="text-xs text-navy-500 mt-1">Try resetting the filter or be the first to upload notes for your batch!</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedSubject('All Subjects'); setSelectedSemester('All Semesters'); }}
              className="mt-4 px-4 py-2 bg-navy-800 text-cream-50 rounded-xl text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id}
              className="bg-cream-100 hover:bg-white rounded-2xl p-5 border border-cream-200 hover:border-teal-400 transition-all shadow-soft hover:shadow-card flex flex-col justify-between"
            >
              <div>
                {/* Badges Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-navy-800 text-cream-50 text-[11px] font-bold rounded-md">
                      {note.subject}
                    </span>
                    <span className="px-2 py-0.5 bg-cream-200 text-navy-700 text-[11px] font-semibold rounded-md">
                      {note.semester}
                    </span>
                  </div>

                  <span className="text-orange-500 font-bold text-xs">★ {note.rating.toFixed(1)}</span>
                </div>

                <h3 className="font-extrabold text-navy-900 text-base leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs text-navy-600 line-clamp-3 mt-2 leading-relaxed">
                  {note.description}
                </p>
              </div>

              {/* Card Footer: Uploader & Download Actions */}
              <div className="mt-5 pt-3.5 border-t border-cream-200">
                <div className="flex items-center justify-between text-xs text-navy-500 mb-3">
                  <span className="text-[11px]">By <strong className="text-navy-900 font-semibold">{note.uploaderName}</strong></span>
                  <span className="text-[11px] font-mono text-navy-400">{note.pages} pages • {note.fileSize}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onPreviewNote(note)}
                    className="w-full bg-cream-200 hover:bg-cream-300 text-navy-800 font-bold text-xs py-2 rounded-xl transition text-center"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => onDownloadNote(note)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Download</span>
                    <span>↓</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
