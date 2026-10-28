import React, { useState } from 'react';

export default function RatingModal({ modalData, onClose, onSubmitRating }) {
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');

  if (!modalData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRating(Number(score), feedback.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-2xl max-w-md w-full p-6 border border-cream-300 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl text-orange-500">★</span>
            <h3 className="font-extrabold text-navy-900 text-lg">
              {modalData.targetType === 'answer' ? 'Rate Peer Answer' : 'Rate Peer Tutor'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-navy-400 hover:text-navy-900 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-navy-600 mb-4">
          How helpful was the explanation by <strong>{modalData.targetName}</strong>? Your rating rewards quality university contributors.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Picker */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
              Score (1 to 5 Stars)
            </label>
            <select 
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-4 py-2.5 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="5">★★★★★ (5 Stars - Exceptional & clear)</option>
              <option value="4">★★★★☆ (4 Stars - Very helpful)</option>
              <option value="3">★★★☆☆ (3 Stars - Decent explanation)</option>
              <option value="2">★★☆☆☆ (2 Stars - Partially helpful)</option>
              <option value="1">★☆☆☆☆ (1 Star - Needs improvement)</option>
            </select>
          </div>

          {/* Feedback Note */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
              Feedback Note (Optional)
            </label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
              placeholder="e.g. Great explanation of memory allocation and index limits!"
              className="w-full bg-cream-50 border border-cream-300 rounded-xl p-3 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-700 hover:bg-cream-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
