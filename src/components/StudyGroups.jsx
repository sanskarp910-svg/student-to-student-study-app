import React from 'react';

export default function StudyGroups({ groups, onToggleJoinGroup, onOpenCreateModal }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 to-teal-900 text-cream-50 p-6 rounded-2xl shadow-card border border-teal-700/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-xs font-semibold mb-2">
            <span>Peer Circles</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Course Study Groups</h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">Join or start weekly problem-solving circles and exam prep squads.</p>
        </div>

        <button 
          onClick={onOpenCreateModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span className="text-base leading-none">+</span>
          <span>Create Study Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((group) => {
          const percentFilled = Math.min(100, Math.round((group.membersCount / group.maxMembers) * 100));
          return (
            <div 
              key={group.id}
              className="bg-cream-100 hover:bg-white rounded-2xl p-6 border border-cream-200 hover:border-teal-400 transition-all shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                      {group.subject}
                    </span>
                    <span className="text-xs text-navy-500 font-semibold">{group.semester}</span>
                  </div>

                  {group.isJoined && (
                    <span className="px-2.5 py-0.5 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                      Joined Member
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-navy-900 text-lg leading-snug">
                  {group.name}
                </h3>

                <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                  {group.description}
                </p>

                {/* Meeting Schedule Pill */}
                <div className="mt-3.5 bg-cream-50 p-2.5 rounded-xl border border-cream-200/80 flex items-center gap-2 text-xs text-navy-700">
                  <span className="text-orange-500">⏰</span>
                  <span className="font-medium">{group.schedule}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {group.tags.map(t => (
                    <span key={t} className="text-[10px] bg-cream-200 text-navy-700 px-2 py-0.5 rounded-md font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Members Capacity and Join Button */}
              <div className="mt-5 pt-3.5 border-t border-cream-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-navy-500">Moderator: <strong className="text-navy-900">{group.moderator}</strong></span>
                  <span className="font-mono font-bold text-navy-800">{group.membersCount}/{group.maxMembers} peers</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden mb-3.5">
                  <div 
                    className={`h-full ${percentFilled > 80 ? 'bg-orange-500' : 'bg-teal-500'}`}
                    style={{ width: `${percentFilled}%` }}
                  ></div>
                </div>

                <button 
                  onClick={() => onToggleJoinGroup(group.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    group.isJoined 
                      ? 'bg-cream-200 hover:bg-cream-300 text-navy-800' 
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                  }`}
                >
                  {group.isJoined ? (
                    <span>✓ Member (Click to Leave)</span>
                  ) : (
                    <span>+ Join Study Group</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
