import React, { useState } from 'react';

export default function BookTutorModal({ tutor, isOpen, onClose, onConfirmBooking }) {
  const [topic, setTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [timeSlot, setTimeSlot] = useState('5:00 PM - 6:00 PM');
  const [contactMode, setContactMode] = useState('Google Meet');

  if (!isOpen || !tutor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmBooking({
      tutor,
      topic: topic.trim() || 'General Subject Doubts',
      date: selectedDate,
      timeSlot,
      contactMode
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cream-300 shadow-elevated">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={tutor.avatar} 
              alt={tutor.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-navy-900 text-base">Book 1-on-1 with {tutor.name}</h3>
                <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{tutor.rate}</span>
              </div>
              <p className="text-xs text-navy-500">{tutor.course} &bull; ★ {tutor.rating.toFixed(1)}</p>
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
              What topic or doubts do you need help with? <span className="text-orange-500">*</span>
            </label>
            <textarea
              required
              rows="3"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Need help with Laplace transforms and partial fraction expansion before mid-terms..."
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3.5 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Preferred Day
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Today">Today (Evening)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Weekend">This Weekend</option>
                <option value="Next Monday">Next Monday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
                Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
                <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                <option value="8:30 PM - 9:30 PM">8:30 PM - 9:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
              Platform
            </label>
            <div className="flex gap-2">
              {['Google Meet', 'Discord Audio', 'Library Study Room'].map(mode => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setContactMode(mode)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    contactMode === mode
                      ? 'bg-navy-900 text-cream-50 border-navy-900 shadow-sm'
                      : 'bg-cream-50 text-navy-700 border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs text-teal-900 flex items-center gap-2">
            <span>💡</span>
            <span>{tutor.name} will be notified via campus notification and will send the session link to your student email.</span>
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
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              Confirm 1-on-1 Request →
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
