import React, { useState } from 'react';
import { SUBJECT_OPTIONS } from '../data/mockData';

export default function DoubtBoard({ 
  doubts, 
  activeDoubtId, 
  setActiveDoubtId, 
  onPostNewClick, 
  onAddAnswer, 
  onUpvoteAnswer, 
  onMarkBestAnswer, 
  onRateAnswer, 
  user 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [replyText, setReplyText] = useState('');

  // If viewing a single doubt thread
  if (activeDoubtId) {
    const doubt = doubts.find(d => d.id === activeDoubtId) || doubts[0];
    
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
        
        {/* Back Button and Subject Badge */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveDoubtId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-navy-700 hover:text-navy-950 bg-cream-100 hover:bg-cream-200 px-3.5 py-2 rounded-xl border border-cream-200 transition"
          >
            <span>←</span>
            <span>Back to Doubt Board</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              {doubt.subject}
            </span>
            <span className="text-xs text-navy-500 font-medium">
              {doubt.semester}
            </span>
          </div>
        </div>

        {/* Question Main Card */}
        <div className="bg-cream-100 rounded-2xl p-6 sm:p-8 border border-cream-200 shadow-soft">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-800 text-cream-50 font-bold flex items-center justify-center text-sm">
                {doubt.authorName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy-900 leading-tight">{doubt.authorName}</h3>
                <p className="text-[11px] text-navy-500 font-mono">{doubt.authorUid} • {doubt.authorCollege}</p>
              </div>
            </div>
            <span className="text-xs text-navy-400">{doubt.createdAt}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 leading-snug mb-3">
            {doubt.title}
          </h1>

          <div className="text-sm text-navy-800 leading-relaxed whitespace-pre-line font-normal">
            {doubt.questionText}
          </div>

          {doubt.codeSnippet && (
            <div className="mt-4">
              <div className="bg-navy-900 text-cream-200 text-xs font-mono px-4 py-1.5 rounded-t-xl border-b border-navy-800 flex items-center justify-between">
                <span>Code / Formula Snippet</span>
                <span className="text-teal-400 text-[10px]">C / Monospace</span>
              </div>
              <pre className="bg-navy-950 text-teal-300 font-mono text-xs p-4 rounded-b-xl overflow-x-auto leading-relaxed border border-navy-800">
                <code>{doubt.codeSnippet}</code>
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-cream-200 text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span>👁 {doubt.views || doubt.views_count || 1} views</span>
              <span>💬 {(doubt.answers || []).length} answers</span>
            </div>
            {(doubt.bestAnswerFlag || doubt.best_answer_flag) && (
              <span className="text-orange-600 font-bold flex items-center gap-1">
                <span>★</span> Best Answer Selected
              </span>
            )}
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <span>Peer Answers</span>
              <span className="text-xs bg-navy-800 text-cream-50 px-2 py-0.5 rounded-full font-mono">
                {(doubt.answers || []).length}
              </span>
            </h2>
            <span className="text-xs text-navy-500">Sorted by helpfulness</span>
          </div>

          {(!doubt.answers || doubt.answers.length === 0) ? (
            <div className="bg-cream-100 rounded-2xl p-8 border border-cream-200 text-center space-y-2">
              <span className="text-3xl">🌱</span>
              <h3 className="font-bold text-navy-900 text-sm">No answers yet!</h3>
              <p className="text-xs text-navy-500 max-w-sm mx-auto">
                Be the first peer to help {doubt.authorName || doubt.author_name} solve this problem. Earn up to 25 peer reputation points!
              </p>
            </div>
          ) : (
            (doubt.answers || []).map((ans) => (
              <div 
                key={ans.id}
                className={`rounded-2xl p-6 border transition shadow-soft ${
                  ans.isBestAnswer 
                    ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-400/40' 
                    : 'bg-cream-100 border-cream-200'
                }`}
              >
                {ans.isBestAnswer && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                    <span>★</span>
                    <span>Verified Best Peer Solution</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ans.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                      alt={ans.authorName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-teal-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-navy-900 leading-tight">{ans.authorName}</h4>
                      <p className="text-[11px] text-navy-500">{ans.authorCollege}</p>
                    </div>
                  </div>
                  <span className="text-xs text-navy-400">{ans.createdAt}</span>
                </div>

                <div className="text-sm text-navy-800 leading-relaxed whitespace-pre-line">
                  {ans.answerText}
                </div>

                {/* Answers Action Bar: Upvote, Rate, Mark Best Answer */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-cream-200/80 text-xs">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onUpvoteAnswer(doubt.id, ans.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 hover:border-teal-400 text-navy-800 font-bold hover:text-teal-700 transition shadow-sm"
                    >
                      <span>▲</span>
                      <span>Helpful ({ans.upvotes})</span>
                    </button>

                    <button 
                      onClick={() => onRateAnswer(doubt.id, ans)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-100/70 hover:bg-orange-200/80 text-orange-800 font-bold transition"
                    >
                      <span>★</span>
                      <span>Rate Answer</span>
                    </button>
                  </div>

                  {!ans.isBestAnswer && (
                    <button 
                      onClick={() => onMarkBestAnswer(doubt.id, ans.id)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                    >
                      ✓ Mark as Best Answer
                    </button>
                  )}
                </div>

                {/* Peer Ratings on this Answer */}
                {ans.ratings && ans.ratings.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-cream-200/60 flex items-center gap-2 text-xs text-navy-600">
                    <span className="font-semibold text-orange-600">Rated {ans.ratings[0].score}★</span>
                    <span>by {ans.ratings[0].rater}:</span>
                    <em className="text-navy-700 font-normal">"{ans.ratings[0].feedback}"</em>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Reply Box */}
        <div className="bg-cream-100 rounded-2xl p-6 border border-cream-200 shadow-soft">
          <h3 className="font-bold text-sm text-navy-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Post Your Answer as {user.name}</span>
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!replyText.trim()) return;
            onAddAnswer(doubt.id, replyText);
            setReplyText('');
          }} className="space-y-3">
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="4"
              required
              placeholder="Write a clear, step-by-step solution. Mention formulas, code bounds, or analogies to help your peer understand..."
              className="w-full bg-cream-50 border border-cream-300 rounded-xl p-4 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-inner font-sans resize-y"
            ></textarea>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-navy-500">Be respectful and encourage collaborative learning.</span>
              <button 
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
              >
                <span>Submit Answer</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }

  // Doubt Board List View
  const filteredDoubts = doubts.filter(d => {
    const matchesSearch = searchQuery === '' || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || d.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 text-cream-50 p-6 rounded-2xl shadow-card">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-900 text-teal-300 rounded-full text-xs font-semibold mb-2">
            <span>Forum Community</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">University Doubt Board</h1>
          <p className="text-xs sm:text-sm text-cream-300 mt-1">Browse, filter, and solve academic questions asked by engineering peers.</p>
        </div>

        <button 
          onClick={onPostNewClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span className="text-base leading-none">+</span>
          <span>Ask a Doubt</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-cream-100 p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
            🔍
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doubts by keyword (e.g. malloc, QuickSort, Maxwell)..."
            className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-700 text-xs">
              ✕
            </button>
          )}
        </div>

        {/* Subject Filter Dropdown */}
        <div className="w-full md:w-56">
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full py-2.5 px-3 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Doubts Feed */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <div className="bg-cream-100 rounded-2xl p-12 text-center border border-cream-200">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="font-bold text-navy-900 text-base">No doubts match your search</h3>
            <p className="text-xs text-navy-500 mt-1">Try another keyword or select "All Subjects".</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedSubject('All Subjects'); }}
              className="mt-4 px-4 py-2 bg-navy-800 text-cream-50 rounded-xl text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredDoubts.map(doubt => (
            <div 
              key={doubt.id}
              onClick={() => setActiveDoubtId(doubt.id)}
              className="bg-cream-100 hover:bg-white rounded-2xl p-5 sm:p-6 border border-cream-200 hover:border-teal-400 transition-all shadow-soft hover:shadow-card cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                    {doubt.subject}
                  </span>
                  <span className="text-xs text-navy-500 font-semibold">{doubt.semester}</span>
                  {doubt.bestAnswerFlag && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <span>★</span> Best Solution
                    </span>
                  )}
                </div>
                <span className="text-xs text-navy-400">{doubt.createdAt}</span>
              </div>

              <h3 className="font-extrabold text-navy-900 text-base sm:text-lg group-hover:text-teal-700 transition leading-snug">
                {doubt.title}
              </h3>

              <p className="text-xs sm:text-sm text-navy-600 line-clamp-2 mt-2 leading-relaxed">
                {doubt.questionText || doubt.question_text}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-cream-200 text-xs text-navy-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-navy-800">{doubt.authorName || doubt.author_name}</span>
                  <span className="text-navy-400">•</span>
                  <span className="font-mono text-[11px] text-navy-400">{doubt.authorUid || doubt.author_uid}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    💬 {(doubt.answers || []).length} {(doubt.answers || []).length === 1 ? 'Answer' : 'Answers'}
                  </span>
                  <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition">
                    Join Discussion →
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
