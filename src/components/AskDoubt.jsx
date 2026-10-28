import React, { useState } from 'react';
import { SUBJECT_OPTIONS, SEMESTER_OPTIONS } from '../data/mockData';

export default function AskDoubt({ onSubmitDoubt, onCancel, defaultSemester = "Semester 4" }) {
  const [subject, setSubject] = useState("Maths");
  const [semester, setSemester] = useState(defaultSemester);
  const [title, setTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !questionText.trim()) return;

    onSubmitDoubt({
      subject,
      semester,
      title: title.trim(),
      questionText: questionText.trim(),
      codeSnippet: codeSnippet.trim()
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 bg-white/20 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Ask a Doubt</h1>
            <p className="text-xs sm:text-sm text-orange-100">Get fast, step-by-step help from seniors and batchmates across college</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-cream-100 rounded-2xl p-6 sm:p-8 border border-cream-200 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Subject & Semester Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Subject <span className="text-orange-500">*</span>
              </label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-4 py-3 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
              >
                {SUBJECT_OPTIONS.filter(s => s !== "All Subjects").map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Semester / Course Level <span className="text-orange-500">*</span>
              </label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="w-full bg-cream-50 border border-cream-300 rounded-xl px-4 py-3 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
              >
                {SEMESTER_OPTIONS.filter(s => s !== "All Semesters").map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Question Summary / One-Liner <span className="text-orange-500">*</span>
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Why does my recursive QuickSort throw StackOverflowError on sorted arrays?"
              className="w-full bg-cream-50 border border-cream-300 rounded-xl px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
            />
          </div>

          {/* Detailed Question Textarea */}
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Describe Your Doubt In Detail <span className="text-orange-500">*</span>
            </label>
            <textarea 
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows="6"
              required
              placeholder="Explain what concept or problem you are struggling with. What have you tried so far? What output or error message are you seeing?"
              className="w-full bg-cream-50 border border-cream-300 rounded-xl p-4 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm font-sans resize-y"
            ></textarea>
          </div>

          {/* Optional Code or Math snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Code Snippet or Mathematical Equation (Optional)
              </label>
              <span className="text-[11px] text-navy-500 font-mono">Monospace syntax</span>
            </div>
            <textarea 
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows="4"
              placeholder="// Paste relevant C code, formula, or logic here&#10;int main() { ... }"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl p-4 text-xs font-mono text-teal-300 placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition shadow-inner resize-y"
            ></textarea>
          </div>

          {/* Posting Guidelines Card */}
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-start gap-3">
            <span className="text-teal-600 text-lg">💡</span>
            <div className="text-xs text-navy-700 space-y-1">
              <p className="font-bold text-teal-900">Tips for getting fast, accurate peer answers:</p>
              <p>• Mention your specific unit or chapter (e.g. Unit 2 Jacobians or Pointers).</p>
              <p>• When someone provides a helpful solution, remember to mark it as the <strong>Best Answer</strong> so they receive university peer credits!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-navy-700 hover:bg-cream-200 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <span>Post Doubt Now</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
