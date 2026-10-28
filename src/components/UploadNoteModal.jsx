import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS } from '../data/mockData';

export default function UploadNoteModal({ isOpen, onClose, onUpload, user }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[1] || 'Maths');
  const [semester, setSemester] = useState(user?.semester || 'Semester 2');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState(8);
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const newNote = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      subject,
      semester,
      description: description.trim() || `Comprehensive handwritten notes and exam problem solutions for ${subject} (${semester}).`,
      pages: Number(pages) || 8,
      fileSize: fileSize.trim() || '3.2 MB',
      rating: 5.0,
      downloads: 0,
      uploaderName: user?.name || "Student Contributor",
      uploaderUid: user?.uid || "STD-USER",
      uploaderCollege: user?.college || "University Campus",
      createdAt: "Just now"
    };

    onUpload(newNote);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cream-300 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
              ↑
            </div>
            <div>
              <h3 className="font-extrabold text-navy-900 text-lg">Upload Course Notes</h3>
              <p className="text-xs text-navy-500">Share study material and earn <strong className="text-orange-600">+20 Peer Points</strong></p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-navy-400 hover:text-navy-900 text-sm font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
              Note Title <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 3: Dynamic Programming & Graphs Hand Notes"
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Subject <span className="text-orange-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SUBJECT_OPTIONS.filter(s => s !== "All Subjects").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Semester <span className="text-orange-500">*</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SEMESTER_OPTIONS.filter(s => s !== "All Semesters").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
              Description & Highlights
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention unit numbers, covered derivations, formulas, or solved previous year question references..."
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Estimated Pages
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Simulated File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 2.4 MB"
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Peer Community Reward note */}
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-orange-950">
            <span className="text-lg">⭐</span>
            <span>Your notes will be verified and published instantly across the peer student network.</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-navy-700 hover:bg-cream-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              {loading ? "Publishing..." : "Publish to Notes Library →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
