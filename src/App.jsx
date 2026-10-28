import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HomeDashboard from './components/HomeDashboard';
import AskDoubt from './components/AskDoubt';
import DoubtBoard from './components/DoubtBoard';
import NotesLibrary from './components/NotesLibrary';
import StudyGroups from './components/StudyGroups';
import PeerTutors from './components/PeerTutors';
import RatingModal from './components/RatingModal';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import LoginScreen from './components/LoginScreen';
import { 
  supabase, 
  isConfigured as isSupabaseConfigured, 
  cloudAuth, 
  cloudDoubts, 
  cloudNotes, 
  cloudGroups 
} from './lib/supabase';
import { 
  INITIAL_DOUBTS, 
  INITIAL_NOTES, 
  INITIAL_STUDY_GROUPS, 
  PEER_TUTORS 
} from './data/mockData';

function normalizeProfile(rawProfile, fallbackUser) {
  if (!rawProfile && !fallbackUser) return null;
  const p = rawProfile || fallbackUser || {};
  return {
    id: p.id || "STD-USER",
    name: p.name || p.user_metadata?.name || (p.email ? p.email.split('@')[0] : "Student"),
    uid: p.uid || p.user_metadata?.uid || "STD-CLOUD",
    college: p.college || p.user_metadata?.college || "University Campus",
    course: p.course || p.user_metadata?.course || "Engineering",
    semester: p.semester || p.user_metadata?.semester || "Semester 1",
    subjects: Array.isArray(p.subjects) && p.subjects.length > 0 
      ? p.subjects 
      : ["Maths", "C Programming", "Data Structures"],
    points: p.points || 100,
    avatar: p.avatar || "https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80",
    doubtsCount: p.doubtsCount || 0,
    answersCount: p.answersCount || 0
  };
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeDoubtId, setActiveDoubtId] = useState(null);

  // 100% Cloud User State (No localStorage for DB)
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Cloud Data Stores
  const [doubts, setDoubts] = useState(INITIAL_DOUBTS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [groups, setGroups] = useState(INITIAL_STUDY_GROUPS);
  const [tutors, setTutors] = useState(PEER_TUTORS);

  // Modals & Notifications
  const [toast, setToast] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState(null);
  const [previewNote, setPreviewNote] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Check Supabase Cloud Auth on Mount
  useEffect(() => {
    async function initCloudSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            setUser(normalizeProfile(profile, session.user));
          }

          // Fetch cloud doubts & notes
          const [cloudDoubtsData, cloudNotesData] = await Promise.all([
            cloudDoubts.fetchAll().catch(() => []),
            cloudNotes.fetchAll().catch(() => [])
          ]);

          if (cloudDoubtsData && cloudDoubtsData.length > 0) {
            const formattedDoubts = cloudDoubtsData.map(d => ({
              id: d.id,
              title: d.title,
              questionText: d.question_text || d.questionText || '',
              codeSnippet: d.code_snippet || d.codeSnippet || '',
              subject: d.subject || 'General',
              semester: d.semester || 'Semester 1',
              authorName: d.author_name || d.authorName || 'Student',
              authorUid: d.author_uid || d.authorUid || 'STD',
              authorCollege: d.author_college || d.authorCollege || 'University',
              createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent',
              views: d.views_count || d.views || 1,
              bestAnswerFlag: d.best_answer_flag || d.bestAnswerFlag || false,
              answers: Array.isArray(d.answers) ? d.answers.map(a => ({
                id: a.id,
                authorName: a.author_name || 'Senior Peer',
                authorUid: a.author_uid || 'STD',
                authorCollege: 'Campus Senior',
                authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                answerText: a.answer_text || a.answerText || '',
                createdAt: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent',
                upvotes: a.upvotes_count || 0,
                isBestAnswer: a.is_best_answer || false,
                ratings: []
              })) : []
            }));
            setDoubts(formattedDoubts);
          }

          if (cloudNotesData && cloudNotesData.length > 0) {
            const formattedNotes = cloudNotesData.map(n => ({
              id: n.id,
              title: n.title,
              subject: n.subject || 'General',
              semester: n.semester || 'Semester 1',
              uploaderName: n.uploader_name || n.uploaderName || 'Peer Contributor',
              downloads: n.downloads_count || n.downloads || 0,
              rating: Number(n.rating || 5.0),
              pages: n.pages || 24,
              fileSize: n.file_size || '3.5 MB',
              description: n.description || 'Comprehensive handwritten unit notes and solved questions.'
            }));
            setNotes(formattedNotes);
          }
        } catch (err) {
          console.warn("Cloud session fetch error:", err);
        }
      }
      setLoadingAuth(false);
    }

    initCloudSession();

    // Listen to Supabase Auth State changes in Real Time
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          setUser(normalizeProfile(profile, session.user));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  // 100% Cloud Registration Handler
  const handleRegister = async (newUserData) => {
    if (isSupabaseConfigured) {
      try {
        const result = await cloudAuth.signUp(newUserData.email, newUserData.password, newUserData);
        setUser(normalizeProfile(result.profile, newUserData));
        setAuthModalConfig(null);
        showNotification(`Account created in Supabase Cloud! Welcome, ${newUserData.name} ☁️`);
      } catch (err) {
        showNotification(err.message || "Cloud registration failed", "error");
      }
    } else {
      setUser(normalizeProfile(newUserData));
      setAuthModalConfig(null);
      showNotification(`Welcome ${newUserData.name}!`);
    }
  };

  // 100% Cloud Login Handler
  const handleLogin = async ({ email, password, user: demoUser }) => {
    if (demoUser) {
      setUser(normalizeProfile(demoUser));
      setAuthModalConfig(null);
      showNotification(`Signed in as ${demoUser.name} (${demoUser.uid})`);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const result = await cloudAuth.signIn(email, password);
        setUser(normalizeProfile(result.profile, result.user));
        setAuthModalConfig(null);
        showNotification(`Welcome back from Supabase Cloud! 🚀`);
      } catch (err) {
        showNotification(err.message || "Invalid cloud login credentials", "error");
      }
    } else {
      setUser(normalizeProfile({
        name: email.split('@')[0],
        email
      }));
      setAuthModalConfig(null);
      showNotification(`Signed in!`);
    }
  };

  // Cloud Sign Out
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await cloudAuth.signOut();
    }
    setUser(null);
    setCurrentTab('home');
    setActiveDoubtId(null);
    showNotification("You have been signed out from the cloud.");
  };

  const handleOpenDoubt = (id) => {
    setActiveDoubtId(id);
    setCurrentTab('doubts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cloud Doubt Creation
  const handlePostDoubt = async (newDoubtData) => {
    const newDoubt = {
      id: `dbt-${Date.now()}`,
      title: newDoubtData.title,
      questionText: newDoubtData.questionText,
      codeSnippet: newDoubtData.codeSnippet || '',
      subject: newDoubtData.subject,
      semester: newDoubtData.semester || user.semester,
      authorName: user.name,
      authorUid: user.uid,
      authorCollege: user.college,
      createdAt: "Just now",
      views: 1,
      bestAnswerFlag: false,
      answers: []
    };

    setDoubts([newDoubt, ...doubts]);
    setUser(prev => ({ ...prev, doubtsCount: (prev.doubtsCount || 0) + 1, points: (prev.points || 0) + 10 }));
    
    // Save to Cloud Table if Supabase is active
    if (isSupabaseConfigured && supabase) {
      try {
        await cloudDoubts.create({
          title: newDoubt.title,
          question_text: newDoubt.questionText,
          code_snippet: newDoubt.codeSnippet,
          subject: newDoubt.subject,
          semester: newDoubt.semester,
          author_name: newDoubt.authorName,
          author_uid: newDoubt.authorUid,
          author_college: newDoubt.authorCollege,
          views_count: 1
        });
      } catch (err) {
        console.warn("Cloud doubt save:", err);
      }
    }

    showNotification("Your doubt has been posted to the campus community! 🎉");
    setActiveDoubtId(newDoubt.id);
    setCurrentTab('doubts');
  };

  // Cloud Answer Creation
  const handleAddAnswer = async (doubtId, answerText) => {
    const newAnswer = {
      id: `ans-${Date.now()}`,
      authorName: user.name,
      authorUid: user.uid,
      authorCollege: `${user.college} (${user.semester || 'Senior'})`,
      authorAvatar: user.avatar,
      answerText: answerText.trim(),
      createdAt: "Just now",
      upvotes: 0,
      isBestAnswer: false,
      ratings: []
    };

    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          answers: [...d.answers, newAnswer]
        };
      }
      return d;
    }));

    setUser(prev => ({ ...prev, answersCount: (prev.answersCount || 0) + 1, points: (prev.points || 0) + 25 }));
    
    if (isSupabaseConfigured && supabase) {
      try {
        await cloudDoubts.addAnswer({
          author_name: newAnswer.authorName,
          author_uid: newAnswer.authorUid,
          answer_text: newAnswer.answerText,
          upvotes_count: 0,
          is_best_answer: false
        });
      } catch (err) {
        console.warn("Cloud answer save:", err);
      }
    }

    showNotification("Answer posted! +25 peer contribution points 🚀");
  };

  const handleUpvoteAnswer = (doubtId, answerId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          answers: d.answers.map(a => a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a)
        };
      }
      return d;
    }));
    showNotification("Upvoted! Thank you for encouraging quality answers.");
  };

  const handleMarkBestAnswer = (doubtId, answerId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          bestAnswerFlag: true,
          answers: d.answers.map(a => ({
            ...a,
            isBestAnswer: a.id === answerId
          }))
        };
      }
      return d;
    }));
    showNotification("Marked as Best Answer! ⭐ Verified badge awarded.");
  };

  const handleToggleJoinGroup = (groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const nextStatus = !g.isJoined;
        return {
          ...g,
          isJoined: nextStatus,
          membersCount: nextStatus ? g.membersCount + 1 : g.membersCount - 1
        };
      }
      return g;
    }));
  };

  const handleSubmitRating = (ratingScore, feedbackText) => {
    if (!showRatingModal) return;

    const raterName = user ? user.name : "Anonymous Peer";

    if (showRatingModal.targetType === 'answer') {
      setDoubts(prev => prev.map(d => {
        if (d.id === showRatingModal.doubtId) {
          return {
            ...d,
            answers: d.answers.map(a => {
              if (a.id === showRatingModal.targetId) {
                return {
                  ...a,
                  ratings: [...(a.ratings || []), { score: ratingScore, feedback: feedbackText || "Helpful explanation!", rater: raterName }]
                };
              }
              return a;
            })
          };
        }
        return d;
      }));
      showNotification(`Thank you! You rated this answer ${ratingScore} Stars. ⭐`);
    } else if (showRatingModal.targetType === 'tutor') {
      setTutors(prev => prev.map(t => {
        if (t.id === showRatingModal.targetId) {
          const newCount = t.reviewsCount + 1;
          const newRating = Number(((t.rating * t.reviewsCount + ratingScore) / newCount).toFixed(1));
          return { ...t, rating: newRating, reviewsCount: newCount };
        }
        return t;
      }));
      showNotification(`Feedback recorded for ${showRatingModal.targetName}!`);
    }

    setShowRatingModal(null);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-navy-800">Connecting to Cloud Platform...</p>
        </div>
      </div>
    );
  }

  // --- MANDATORY LOGIN GATE ---
  // Zero local storage presets! Always asks for login on open!
  if (!user) {
    return (
      <>
        {toast && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 transition-all">
            <div className="bg-navy-900 text-cream-50 px-4 py-3.5 rounded-xl shadow-elevated border border-teal-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
                <p className="text-sm font-medium text-cream-100">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-navy-400 hover:text-white text-xs p-1">
                ✕
              </button>
            </div>
          </div>
        )}
        <LoginScreen 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    );
  }

  // Once authenticated, render full platform:
  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-navy-900 selection:bg-teal-100 selection:text-teal-900 animate-fadeIn">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 transition-all">
          <div className="bg-navy-900 text-cream-50 px-4 py-3.5 rounded-xl shadow-elevated border border-teal-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
              <p className="text-sm font-medium text-cream-100">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-navy-400 hover:text-white text-xs p-1">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeDoubtId={activeDoubtId}
        setActiveDoubtId={setActiveDoubtId}
        user={user}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenSupabase={() => showNotification("Cloud Database: Managed by Supabase Cloud ☁️")}
        onLogout={handleLogout}
        doubtsCount={doubts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {currentTab === 'home' && !activeDoubtId && (
          <HomeDashboard 
            user={user}
            doubts={doubts}
            notes={notes}
            groups={groups}
            onSelectTab={(tab) => { setCurrentTab(tab); setActiveDoubtId(null); }}
            onOpenDoubt={handleOpenDoubt}
            onSelectSubject={(subj) => { setCurrentTab('doubts'); }}
            onPreviewNote={(note) => setPreviewNote(note)}
            onDownloadNote={(note) => {
              setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n));
              showNotification(`Downloading ${note.title}... (${note.fileSize})`);
            }}
          />
        )}

        {currentTab === 'ask' && (
          <AskDoubt 
            onSubmitDoubt={handlePostDoubt}
            onCancel={() => setCurrentTab('home')}
            defaultSemester={user.semester}
          />
        )}

        {currentTab === 'doubts' && (
          <DoubtBoard 
            doubts={doubts}
            activeDoubtId={activeDoubtId}
            setActiveDoubtId={setActiveDoubtId}
            onPostNewClick={() => { setCurrentTab('ask'); setActiveDoubtId(null); }}
            onAddAnswer={handleAddAnswer}
            onUpvoteAnswer={handleUpvoteAnswer}
            onMarkBestAnswer={handleMarkBestAnswer}
            onRateAnswer={(doubtId, ans) => setShowRatingModal({
              targetType: 'answer',
              doubtId,
              targetId: ans.id,
              targetName: ans.authorName
            })}
            user={user}
          />
        )}

        {currentTab === 'notes' && (
          <NotesLibrary 
            notes={notes}
            onPreviewNote={(note) => setPreviewNote(note)}
            onDownloadNote={(note) => {
              setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n));
              showNotification(`Downloading ${note.title}... (${note.fileSize})`);
            }}
            onOpenUploadModal={() => showNotification("Upload note modal active.")}
          />
        )}

        {currentTab === 'groups' && (
          <StudyGroups 
            groups={groups}
            onToggleJoinGroup={handleToggleJoinGroup}
            onOpenCreateModal={() => showNotification("Create group modal active.")}
          />
        )}

        {currentTab === 'tutors' && (
          <PeerTutors 
            tutors={tutors}
            onBookTutor={(tutor) => showNotification(`Session request sent to ${tutor.name}! They will confirm via college email.`)}
            onRateTutor={(tutor) => setShowRatingModal({
              targetType: 'tutor',
              targetId: tutor.id,
              targetName: tutor.name
            })}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setActiveDoubtId={setActiveDoubtId}
      />

      {/* Authentication Modal (when switching accounts or registering from menu) */}
      {authModalConfig && (
        <AuthModal 
          isOpen={authModalConfig.isOpen}
          initialMode={authModalConfig.mode}
          onClose={() => setAuthModalConfig(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Rating Modal */}
      <RatingModal 
        modalData={showRatingModal}
        onClose={() => setShowRatingModal(null)}
        onSubmitRating={handleSubmitRating}
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-cream-100 rounded-2xl max-w-xl w-full p-6 border border-cream-300 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-navy-800 text-cream-50 text-xs font-bold rounded-md">{previewNote.subject}</span>
                <span className="text-xs text-navy-500 font-semibold">{previewNote.semester}</span>
              </div>
              <button onClick={() => setPreviewNote(null)} className="text-navy-400 hover:text-navy-900 text-sm font-bold">
                ✕
              </button>
            </div>

            <h3 className="font-extrabold text-navy-900 text-lg leading-snug">{previewNote.title}</h3>
            <p className="text-xs text-navy-600 mt-2">{previewNote.description}</p>

            <div className="my-4 bg-white border border-cream-300 rounded-xl p-6 shadow-inner text-navy-800 font-serif text-xs space-y-2.5">
              <div className="border-b border-gray-200 pb-2 mb-2 flex justify-between font-sans text-[10px] text-gray-500">
                <span>UNIT NOTE PREVIEW • PAGE 1 OF {previewNote.pages}</span>
                <span>Uploader: {previewNote.uploaderName}</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-navy-900">{previewNote.title}</h4>
              <p>1. Fundamental Definitions & Theorems applicable to {previewNote.subject}.</p>
              <p>2. Detailed derivation of standard equations and boundary conditions.</p>
              <p>3. Solved examples from previous year university exam papers.</p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 font-mono text-[11px]">
                [Handwritten notes, circuit diagrams, and exam tricks]
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-navy-500 font-mono">{previewNote.fileSize} • {previewNote.downloads} peers downloaded</span>
              <button 
                onClick={() => {
                  showNotification(`Downloading "${previewNote.title}"...`);
                  setPreviewNote(null);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
              >
                Download Full PDF ↓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-navy-950 text-cream-300 border-t border-navy-800 py-8 px-4 text-center text-xs space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 font-bold text-cream-100 text-sm">
          <span className="text-teal-400">Student to Student Study App</span>
          <span>•</span>
          <span className="text-orange-400">Peer Learning Network</span>
        </div>
        <p className="text-navy-400 max-w-md mx-auto">
          Connecting university engineering students for collaborative doubts solving, verified course notes sharing, and peer mentoring.
        </p>
        <p className="text-[11px] text-navy-500 pt-2">
          100% Cloud-Managed Architecture &bull; Powered by Supabase Cloud &amp; Vercel
        </p>
      </footer>

    </div>
  );
}
