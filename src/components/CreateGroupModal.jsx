import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS } from '../data/mockData';

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup, user }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[1] || 'Maths');
  const [semester, setSemester] = useState(user?.semester || 'Semester 2');
  const [schedule, setSchedule] = useState('Every Tue & Thu 6:00 PM');
  const [maxMembers, setMaxMembers] = useState(8);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const newGroup = {
      id: `grp-${Date.now()}`,
      name: name.trim(),
      subject,
      semester,
      schedule: schedule.trim() || 'Weekly Sessions (Discord / Google Meet)',
      membersCount: 1, // Creator is first member
      maxMembers: Number(maxMembers) || 8,
      isJoined: true, // Auto-joined
      description: description.trim() || `Collaborative peer study circle for ${subject}. We solve syllabus problem sheets, discuss past year papers, and do mock tests together.`,
      creatorName: user?.name || "Student",
      creatorUid: user?.uid || "STD-USER"
    };

    onCreateGroup(newGroup);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cream-300 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              👥
            </div>
            <div>
              <h3 className="font-extrabold text-navy-900 text-lg">Create New Study Circle</h3>
              <p className="text-xs text-navy-500">Assemble peer classmates for exam prep and weekly doubt sessions</p>
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
              Group Circle Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. End-Sem Discrete Mathematics Drill Squad"
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
              Meeting Time & Mode
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="e.g. Every Monday & Thursday 7:00 PM (Google Meet)"
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
              Member Limit (Capacity)
            </label>
            <input
              type="number"
              min="2"
              max="30"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
              Group Goals & Details
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What topics will your group focus on? (e.g., Solving assignments, discussing previous university exams)..."
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              {loading ? "Creating..." : "Launch Study Group 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
