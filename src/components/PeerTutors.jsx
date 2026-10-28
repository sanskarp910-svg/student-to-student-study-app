import React from 'react';

export default function PeerTutors({ tutors, onBookTutor, onRateTutor }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-950 text-cream-50 p-6 rounded-2xl shadow-card border border-navy-700">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-500 text-navy-950 rounded-full text-xs font-bold mb-2">
          <span>1-on-1 Academic Help</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Peer Tutors Directory</h1>
        <p className="text-xs sm:text-sm text-cream-200 mt-1">Connect with verified seniors and high-achieving classmates for 1-on-1 doubts clearing.</p>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tutors.map((tutor) => (
          <div 
            key={tutor.id}
            className="bg-cream-100 hover:bg-white rounded-2xl p-6 border border-cream-200 hover:border-teal-400 transition-all shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={tutor.avatar} 
                    alt={tutor.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-navy-900">{tutor.name}</h3>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 font-bold text-[10px] rounded-full">
                        {tutor.badge}
                      </span>
                    </div>
                    <p className="text-xs text-navy-500">{tutor.course}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-orange-500 font-bold text-sm">★ {tutor.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-navy-400 block">({tutor.reviewsCount} reviews)</span>
                  <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">{tutor.rate}</span>
                </div>
              </div>

              <p className="text-xs text-navy-600 leading-relaxed mt-2">
                {tutor.bio}
              </p>

              <div className="mt-3.5">
                <span className="text-[11px] font-bold text-navy-800 uppercase tracking-wider block mb-1.5">Subjects Tutored:</span>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects.map(sub => (
                    <span key={sub} className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-lg font-semibold">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-xs text-navy-500 flex items-center gap-1.5">
                <span className="text-teal-600">📅</span>
                <span>Availability: <strong className="text-navy-800">{tutor.availability}</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-3.5 border-t border-cream-200 flex items-center gap-2">
              <button 
                onClick={() => onBookTutor(tutor)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition text-center shadow-sm"
              >
                Book Free Session
              </button>
              <button 
                onClick={() => onRateTutor(tutor)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition"
              >
                Rate Tutor
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
