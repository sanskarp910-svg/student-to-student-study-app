import React from 'react';

export default function ProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-2xl max-w-md w-full p-6 border border-cream-300 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-navy-900 text-lg">Student Profile</h3>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-900 text-sm font-bold">
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80"} alt={user.name || "Student"} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500" />
          <div>
            <h4 className="font-extrabold text-navy-900 text-base">{user.name || "Student"}</h4>
            <p className="text-xs text-teal-700 font-mono font-bold">{user.uid || "STD-USER"}</p>
            <p className="text-[11px] text-navy-500">{user.college || "University Campus"}</p>
          </div>
        </div>

        <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-200 space-y-1.5 text-xs text-navy-700 mb-4">
          <p><strong>Course:</strong> {user.course || "Engineering"}</p>
          <p><strong>Current Level:</strong> {user.semester || "Semester 1"}</p>
          <p><strong>Enrolled Subjects:</strong> {(user.subjects || []).join(", ") || "General Studies"}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-navy-900 text-cream-50 p-2.5 rounded-xl">
            <span className="block font-bold text-teal-400 text-base">{user.doubtsCount || 4}</span>
            <span className="text-[10px] text-cream-300">Doubts Asked</span>
          </div>
          <div className="bg-navy-900 text-cream-50 p-2.5 rounded-xl">
            <span className="block font-bold text-orange-400 text-base">{user.answersCount || 12}</span>
            <span className="text-[10px] text-cream-300">Answers Given</span>
          </div>
          <div className="bg-navy-900 text-cream-50 p-2.5 rounded-xl">
            <span className="block font-bold text-teal-300 text-base">{user.points || 460}</span>
            <span className="text-[10px] text-cream-300">Peer Points</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-navy-800 hover:bg-navy-900 text-cream-50 font-bold text-xs py-2.5 rounded-xl transition"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}
