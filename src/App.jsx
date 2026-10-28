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
import SupabaseModal from './components/SupabaseModal';
import { getSupabase, isSupabaseConnected } from './lib/supabase';
import { 
  CURRENT_USER, 
  MOCK_USERS,
  INITIAL_DOUBTS, 
  INITIAL_NOTES, 
  INITIAL_STUDY_GROUPS, 
  PEER_TUTORS 
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeDoubtId, setActiveDoubtId] = useState(null);

  // Registered Users Directory (Persisted in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('study_app_registered_users');
      return saved ? JSON.parse(saved) : MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  });

  // Current Logged-In User (Persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('study_app_current_user');
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('study_app_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('study_app_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('study_app_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Core Data Stores
  const [doubts, setDoubts] = useState(INITIAL_DOUBTS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [groups, setGroups] = useState(INITIAL_STUDY_GROUPS);
  const [tutors, setTutors] = useState(PEER_TUTORS);

  // Modals & Notifications
  const [toast, setToast] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState(null);
  const [previewNote, setPreviewNote] = useState(null);
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConnected());

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Auth Handlers
  const handleRegister = async (newUserData) => {
    // Check if user already exists
    const exists = registeredUsers.some(
      u => u.uid.toLowerCase() === newUserData.uid.toLowerCase() || 
           (u.email && u.email.toLowerCase() === newUserData.email.toLowerCase())
    );

    if (exists) {
      showNotification("A student with this UID or Email is already registered!", "error");
      return;
    }

    const updatedList = [newUserData, ...registeredUsers];
    setRegisteredUsers(updatedList);
    setUser(newUserData);
    setAuthModalConfig(null);

    // If Supabase is connected, sync directly
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').insert([{
          name: newUserData.name,
          uid: newUserData.uid,
          college: newUserData.college,
          course: newUserData.course,
          semester: newUserData.semester,
          email: newUserData.email,
          points: newUserData.points
        }]);
      } catch (e) {
        console.warn("Supabase profile sync:", e);
      }
    }

    showNotification(`Welcome to campus, ${newUserData.name}! Registered with +100 bonus points 🎉`);
  };

  const handleLogin = ({ email, user: demoUser }) => {
    if (demoUser) {
      setUser(demoUser);
      setAuthModalConfig(null);
      showNotification(`Switched to ${demoUser.name} (${demoUser.uid})`);
      return;
    }

    const found = registeredUsers.find(
      u => (u.email && u.email.toLowerCase() === email.toLowerCase()) ||
           u.uid.toLowerCase() === email.toLowerCase() ||
           u.name.toLowerCase().includes(email.toLowerCase())
    );

    if (found) {
      setUser(found);
      setAuthModalConfig(null);
      showNotification(`Welcome back, ${found.name}! 🚀`);
    } else {
      const tempUser = {
        uid: email.startsWith('STD-') ? email : `STD-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        college: "Apex Institute of Eng & Technology",
        course: "B.Tech Computer Science",
        semester: "Semester 3",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        subjects: ["Maths", "C Programming", "Physics"],
        points: 150,
        doubtsCount: 0,
        answersCount: 0
      };
      setRegisteredUsers([tempUser, ...registeredUsers]);
      setUser(tempUser);
      setAuthModalConfig(null);
      showNotification(`Signed in as ${tempUser.name}!`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    showNotification("You have been signed out. You can browse or register anytime.");
  };

  const handleOpenDoubt = (id) => {
    setActiveDoubtId(id);
    setCurrentTab('doubts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostDoubt = async (newDoubtData) => {
    if (!user) {
      setAuthModalConfig({ isOpen: true, mode: 'register' });
      showNotification("Please sign in or register to post academic doubts.", "error");
      return;
    }

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
    
    // Sync to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('doubts').insert([{
          title: newDoubt.title,
          question_text: newDoubt.questionText,
          code_snippet: newDoubt.codeSnippet,
          subject: newDoubt.subject,
          semester: newDoubt.semester,
          author_name: newDoubt.authorName,
          author_uid: newDoubt.authorUid,
          author_college: newDoubt.authorCollege,
          views_count: 1
        }]);
      } catch (e) {
        console.warn("Supabase doubt insert:", e);
      }
    }

    showNotification("Your doubt has been posted to the campus community! 🎉");
    setActiveDoubtId(newDoubt.id);
    setCurrentTab('doubts');
  };

  const handleAddAnswer = async (doubtId, answerText) => {
    if (!user) {
      setAuthModalConfig({ isOpen: true, mode: 'register' });
      showNotification("Please sign in or register to post an answer.", "error");
      return;
    }

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
    
    // Sync to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('answers').insert([{
          author_name: newAnswer.authorName,
          author_uid: newAnswer.authorUid,
          answer_text: newAnswer.answerText,
          upvotes_count: 0,
          is_best_answer: false
        }]);
      } catch (e) {
        console.warn("Supabase answer insert:", e);
      }
    }

    showNotification("Answer posted! You earned +25 peer contribution points 🚀");
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
    if (!user) {
      setAuthModalConfig({ isOpen: true, mode: 'register' });
      showNotification("Please register or log in to join student study groups.", "error");
      return;
    }

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

  // Safe fallback user for displaying the dashboard if user logged out
  const displayUser = user || {
    name: "Guest Student",
    uid: "GUEST",
    college: "Visitor Campus",
    course: "General Studies",
    semester: "Semester 1",
    subjects: ["Maths", "C Programming", "Physics"],
    points: 0,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-navy-900 selection:bg-teal-100 selection:text-teal-900">
      
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
        onOpenSupabase={() => setShowSupabaseModal(true)}
        onLogout={handleLogout}
        doubtsCount={doubts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {/* Banner if user is browsing as guest */}
        {!user && (
          <div className="mb-6 bg-gradient-to-r from-teal-900 to-navy-900 text-cream-50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-teal-500/30 shadow-card">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-white">Join your university peers on PeerLearn!</p>
                <p className="text-xs text-cream-300">Register to post doubts, access verified course notes, and earn peer credits.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
                className="text-xs font-bold text-cream-200 hover:text-white px-3 py-1.5 rounded-xl bg-navy-800 border border-navy-700"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
                className="text-xs font-bold text-white px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 shadow"
              >
                Register Now (+100 pts)
              </button>
            </div>
          </div>
        )}

        {currentTab === 'home' && !activeDoubtId && (
          <HomeDashboard 
            user={displayUser}
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
            defaultSemester={displayUser.semester}
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
            user={displayUser}
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

      {/* Supabase Cloud Data Inspector Modal */}
      <SupabaseModal 
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onConnectedChange={(status) => {
          setSupabaseConnected(status);
          showNotification(status ? "Supabase Cloud Database connected! ⚡" : "Supabase disconnected.");
        }}
      />

      {/* Authentication Modal (Sign In & Register) */}
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
          user={displayUser}
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
          Designed with Navy Blue, Cream, Teal, and Orange • Fully responsive mobile-friendly layout
        </p>
      </footer>

    </div>
  );
}
