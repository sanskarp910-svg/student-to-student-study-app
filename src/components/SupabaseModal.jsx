import React, { useState, useEffect } from 'react';
import { 
  getSupabaseCredentials, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  isSupabaseConnected, 
  fetchDatabaseStats 
} from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose, onConnectedChange }) {
  const [credentials, setCredentials] = useState(getSupabaseCredentials());
  const [url, setUrl] = useState(credentials.url || '');
  const [key, setKey] = useState(credentials.key || '');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const connected = isSupabaseConnected();

  const loadStats = async () => {
    if (connected) {
      setLoadingStats(true);
      const data = await fetchDatabaseStats();
      setStats(data);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url || '');
      setKey(creds.key || '');
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) return;

    saveSupabaseConfig(url.trim(), key.trim());
    setSaveSuccess(true);
    setLoadingStats(true);
    const data = await fetchDatabaseStats();
    setStats(data);
    setLoadingStats(false);
    if (onConnectedChange) onConnectedChange(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setKey('');
    setStats(null);
    if (onConnectedChange) onConnectedChange(false);
  };

  const sqlSetup = `-- RUN THIS IN SUPABASE SQL EDITOR TO CREATE TABLES:
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  uid TEXT UNIQUE NOT NULL,
  college TEXT NOT NULL,
  course TEXT NOT NULL,
  semester TEXT NOT NULL,
  email TEXT,
  points INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  subject TEXT NOT NULL,
  semester TEXT NOT NULL,
  author_name TEXT,
  author_uid TEXT,
  author_college TEXT,
  views_count INT DEFAULT 1,
  best_answer_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doubt_id UUID REFERENCES doubts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_uid TEXT,
  answer_text TEXT NOT NULL,
  upvotes_count INT DEFAULT 0,
  is_best_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester TEXT NOT NULL,
  uploader_name TEXT,
  downloads_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSetup);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-cream-300 shadow-elevated max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center font-bold text-xl border border-[#3ECF8E]/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-navy-900">Supabase Cloud Database</h2>
                {connected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-navy-500">PostgreSQL cloud storage & live analytics</p>
            </div>
          </div>

          <button onClick={onClose} className="text-navy-400 hover:text-navy-900 text-sm font-bold p-1">
            ✕
          </button>
        </div>

        {/* SECTION 1: LIVE DATA COLLECTED INSPECTOR */}
        <div className="mt-5 space-y-4">
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>📊</span>
                <span>Amount of Data Collected</span>
              </span>
              {connected && (
                <button 
                  onClick={loadStats} 
                  disabled={loadingStats}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  {loadingStats ? 'Refreshing...' : '↻ Refresh Counts'}
                </button>
              )}
            </div>

            {connected ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-white p-3 rounded-xl border border-cream-200">
                  <span className="text-xl font-extrabold text-teal-600 block">
                    {stats ? stats.profilesCount : '...'}
                  </span>
                  <span className="text-[10px] text-navy-500 uppercase font-bold">Students</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200">
                  <span className="text-xl font-extrabold text-orange-500 block">
                    {stats ? stats.doubtsCount : '...'}
                  </span>
                  <span className="text-[10px] text-navy-500 uppercase font-bold">Doubts</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200">
                  <span className="text-xl font-extrabold text-navy-800 block">
                    {stats ? stats.answersCount : '...'}
                  </span>
                  <span className="text-[10px] text-navy-500 uppercase font-bold">Answers</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200">
                  <span className="text-xl font-extrabold text-teal-700 block">
                    {stats ? stats.notesCount : '...'}
                  </span>
                  <span className="text-[10px] text-navy-500 uppercase font-bold">Notes</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-navy-600 space-y-1">
                <p className="font-semibold text-navy-900">No live Supabase project plugged in yet.</p>
                <p className="text-navy-500">Enter your Project URL and API Key below to view real-time data collected on Supabase.</p>
              </div>
            )}
          </div>

          {/* SECTION 2: CONNECTION CREDENTIALS */}
          <form onSubmit={handleSave} className="space-y-4 bg-cream-50 p-4 rounded-2xl border border-cream-200">
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider">
              {connected ? 'Update Connection Credentials' : 'Connect Your Supabase Project'}
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase mb-1">
                Supabase Project URL
              </label>
              <input 
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-navy-700 uppercase mb-1">
                Supabase Anon / Public Key
              </label>
              <input 
                type="password"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs text-navy-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {saveSuccess && (
              <div className="p-2.5 bg-teal-100 border border-teal-300 text-teal-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <span>✓</span>
                <span>Supabase credentials saved & connected!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {connected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Disconnect Project
                </button>
              ) : (
                <span className="text-[11px] text-navy-500">Free at supabase.com</span>
              )}

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
              >
                {connected ? 'Save & Sync' : 'Plug in Supabase'}
              </button>
            </div>
          </form>

          {/* SECTION 3: 1-CLICK SQL TABLE SETUP */}
          <div className="bg-navy-950 text-cream-100 p-4 rounded-2xl border border-navy-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400">Database Tables Schema (SQL)</span>
              <button
                type="button"
                onClick={copySql}
                className="bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition"
              >
                {copiedSql ? '✓ Copied SQL!' : 'Copy SQL Script'}
              </button>
            </div>
            <p className="text-[11px] text-navy-400">
              Paste this in <strong>Supabase &rarr; SQL Editor</strong> to create all tables with one click.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
