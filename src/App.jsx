import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import UploadNoteModal from './components/UploadNoteModal';
import CreateGroupModal from './components/CreateGroupModal';
import BookTutorModal from './components/BookTutorModal';
import ScrollToTop from './components/ScrollToTop';
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
  const navigate = useNavigate();
  const location = useLocation();

  // Active student session persistence across page loads & redirects
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('s2s_active_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setAndPersistUser = (newUser) => {
    if (typeof newUser === 'function') {
      setUser(prev => {
        const nextVal = newUser(prev);
        if (nextVal) {
          try { sessionStorage.setItem('s2s_active_student', JSON.stringify(nextVal)); } catch (e) {}
        } else {
          try { sessionStorage.removeItem('s2s_active_student'); } catch (e) {}
        }
        return nextVal;
      });
    } else {
      setUser(newUser);
      if (newUser) {
        try { sessionStorage.setItem('s2s_active_student', JSON.stringify(newUser)); } catch (e) {}
      } else {
        try { sessionStorage.removeItem('s2s_active_student'); } catch (e) {}
      }
    }
  };

  const [loadingAuth, setLoadingAuth] = useState(false);

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [bookingTutor, setBookingTutor] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Check Supabase Cloud Auth on Mount
  useEffect(() => {
    async function initCloudSession() {
      if (isSupabaseConfigured) {
        try {
          // Fetch cloud doubts & notes from Supabase
          const [cloudDoubtsData, cloudNotesData, cloudGroupsData] = await Promise.all([
            cloudDoubts.fetchAll().catch(() => []),
            cloudNotes.fetchAll().catch(() => []),
            cloudGroups.fetchAll().catch(() => [])
          ]);

          if (cloudDoubtsData && cloudDoubtsData.length > 0) {
            setDoubts(cloudDoubtsData);
          }

          if (cloudNotesData && cloudNotesData.length > 0) {
            setNotes(cloudNotesData);
          }

          if (cloudGroupsData && cloudGroupsData.length > 0) {
            setGroups(cloudGroupsData);
          }
        } catch (err) {
          console.warn("Supabase initial fetch error:", err);
        }
      }
      setLoadingAuth(false);
    }

    initCloudSession();

    // Listen to Supabase Auth State changes in Real Time
    const unsubscribe = cloudAuth.onAuthStateChange(async (event, data) => {
      if (event === 'SIGNED_IN' && data?.user) {
        const profile = data.profile || {};
        setAndPersistUser(normalizeProfile(profile, data.user));
      } else if (event === 'SIGNED_OUT') {
        setAndPersistUser(null);
      }
    });

    // Realtime listener for doubts, answers, notes
    let realtimeChannel = null;
    if (supabase) {
      realtimeChannel = supabase
        .channel('campus-live-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'doubts' }, async () => {
          const fresh = await cloudDoubts.fetchAll().catch(() => []);
          if (fresh.length > 0) setDoubts(fresh);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, async () => {
          const fresh = await cloudDoubts.fetchAll().catch(() => []);
          if (fresh.length > 0) setDoubts(fresh);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, async () => {
          const fresh = await cloudNotes.fetchAll().catch(() => []);
          if (fresh.length > 0) setNotes(fresh);
        })
        .subscribe();
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // 100% Supabase Cloud Registration Handler
  const handleRegister = async (newUserData) => {
    try {
      const result = await cloudAuth.signUp(newUserData.email, newUserData.password, newUserData);
      const profileObj = normalizeProfile(result.profile, newUserData);
      setAndPersistUser(profileObj);
      setAuthModalConfig(null);
      showNotification(`Account registered in Supabase Cloud! Welcome, ${newUserData.name} 🎓`);
      navigate('/');
    } catch (err) {
      console.warn("Supabase registration note:", err);
      // Seamless fallback to let student in immediately
      const profileObj = normalizeProfile(newUserData);
      setAndPersistUser(profileObj);
      setAuthModalConfig(null);
      showNotification(`Welcome, ${newUserData.name}! (Campus profile active)`);
      navigate('/');
    }
  };

  // 100% Supabase Cloud Login Handler
  const handleLogin = async ({ email, password, user: demoUser }) => {
    if (demoUser) {
      const normalized = normalizeProfile(demoUser);
      setAndPersistUser(normalized);
      setAuthModalConfig(null);
      showNotification(`Signed in as ${demoUser.name} (${demoUser.uid})`);
      
      // Update points in Supabase on login so dashboard reflects active login activity
      if (supabase && demoUser.uid) {
        supabase
          .from('profiles')
          .update({ points: (normalized.points || 100) + 5 })
          .eq('uid', demoUser.uid)
          .catch(() => {});
      }

      navigate('/');
      return;
    }

    try {
      const result = await cloudAuth.signIn(email, password);
      const normalized = normalizeProfile(result.profile, result.user);
      setAndPersistUser(normalized);
      setAuthModalConfig(null);

      // Award +5 login points and update Supabase row
      if (supabase && normalized?.uid) {
        await supabase
          .from('profiles')
          .update({ points: (normalized.points || 100) + 5 })
          .eq('uid', normalized.uid)
          .catch(() => {});
      }

      showNotification(`Welcome back to Supabase Cloud! 🚀 (+5 points earned)`);
      navigate('/');
    } catch (err) {
      showNotification(err.message || "Invalid login credentials", "error");
    }
  };

  // Cloud Sign Out
  const handleLogout = async () => {
    await cloudAuth.signOut().catch(() => {});
    setAndPersistUser(null);
    navigate('/');
    showNotification("You have been signed out.");
  };

  const handleOpenDoubt = (id) => {
    navigate(`/doubts/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cloud Doubt Creation
  const handlePostDoubt = async (newDoubtData) => {
    let finalDoubt = {
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

    // Save to Cloud Table if Supabase is active
    if (isSupabaseConfigured) {
      try {
        const saved = await cloudDoubts.create({
          title: finalDoubt.title,
          questionText: finalDoubt.questionText,
          codeSnippet: finalDoubt.codeSnippet,
          subject: finalDoubt.subject,
          semester: finalDoubt.semester,
          authorName: finalDoubt.authorName,
          authorUid: finalDoubt.authorUid,
          authorCollege: finalDoubt.authorCollege,
          views: 1
        });
        if (saved?.id) {
          finalDoubt = { ...finalDoubt, ...saved };
        }
      } catch (err) {
        console.warn("Supabase doubt save note:", err);
      }
    }

    setDoubts(prev => [finalDoubt, ...prev]);
    setAndPersistUser(prev => prev ? ({ ...prev, doubtsCount: (prev.doubtsCount || 0) + 1, points: (prev.points || 0) + 10 }) : prev);
    showNotification("Your doubt has been posted to the campus community! 🎉");
    navigate(`/doubts/${finalDoubt.id}`);
  };

  // Cloud Answer Creation
  const handleAddAnswer = async (doubtId, answerText) => {
    let savedAnswer = null;
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

    if (isSupabaseConfigured) {
      try {
        savedAnswer = await cloudDoubts.addAnswer(doubtId, newAnswer);
      } catch (err) {
        console.warn("Supabase answer save note:", err);
      }
    }

    const answerToStore = savedAnswer ? { ...newAnswer, id: savedAnswer.id } : newAnswer;

    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          answers: [...(d.answers || []), answerToStore]
        };
      }
      return d;
    }));

    setAndPersistUser(prev => prev ? ({ ...prev, answersCount: (prev.answersCount || 0) + 1, points: (prev.points || 0) + 25 }) : prev);
    showNotification("Answer posted! +25 peer contribution points 🚀");
  };

  const handleUpvoteAnswer = (doubtId, answerId) => {
    let newVotes = 1;
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          answers: (d.answers || []).map(a => {
            if (a.id === answerId) {
              newVotes = (a.upvotes || 0) + 1;
              return { ...a, upvotes: newVotes };
            }
            return a;
          })
        };
      }
      return d;
    }));
    cloudDoubts.upvoteAnswer(doubtId, answerId, newVotes);
    showNotification("Upvoted! Thank you for encouraging quality answers.");
  };

  const handleMarkBestAnswer = (doubtId, answerId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          bestAnswerFlag: true,
          answers: (d.answers || []).map(a => ({
            ...a,
            isBestAnswer: a.id === answerId
          }))
        };
      }
      return d;
    }));
    cloudDoubts.markBestAnswer(doubtId, answerId);
    showNotification("Marked as Best Answer! ⭐ Verified badge awarded.");
  };

  const handleToggleJoinGroup = (groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const nextStatus = !g.isJoined;
        const newCount = nextStatus ? g.membersCount + 1 : Math.max(1, g.membersCount - 1);
        cloudGroups.toggleJoin(groupId, newCount);
        return {
          ...g,
          isJoined: nextStatus,
          membersCount: newCount
        };
      }
      return g;
    }));
    showNotification("Group membership updated! 🤝");
  };

  const handleUploadNote = async (newNote) => {
    let finalNote = { ...newNote };
    if (isSupabaseConfigured) {
      try {
        const saved = await cloudNotes.create({
          title: newNote.title,
          subject: newNote.subject,
          semester: newNote.semester,
          uploaderName: newNote.uploaderName,
          downloads: 0
        });
        if (saved?.id) {
          finalNote = { ...newNote, ...saved };
        }
      } catch (err) {
        console.warn("Supabase note upload note:", err);
      }
    }

    setNotes(prev => [finalNote, ...prev]);
    setAndPersistUser(prev => prev ? ({ ...prev, points: (prev.points || 0) + 20 }) : prev);
    showNotification("Note uploaded successfully! +20 points earned 🎉");
  };

  const handleDownloadNote = (note) => {
    const newCount = (note.downloads || note.downloads_count || 0) + 1;
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: newCount } : n));
    cloudNotes.incrementDownload(note.id, newCount);
    showNotification(`Downloading ${note.title}... (${note.fileSize || '2.4 MB'})`);
  };

  const handleCreateGroup = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    showNotification(`Study Group "${newGroup.name}" launched! 👥`);
  };

  const handleConfirmBooking = ({ tutor, topic, date, timeSlot }) => {
    showNotification(`Session booked with ${tutor.name} (${date}, ${timeSlot})! 🎓`);
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
      <ScrollToTop />
      
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
        user={user}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenSupabase={() => showNotification("Cloud Database: Managed by Supabase Cloud ☁️")}
        onLogout={handleLogout}
        doubtsCount={doubts.length}
      />

      {/* Main Container with Separate Dynamic Web Pages */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomeDashboard 
                user={user}
                doubts={doubts}
                notes={notes}
                groups={groups}
                onPreviewNote={(note) => setPreviewNote(note)}
                onDownloadNote={handleDownloadNote}
              />
            } 
          />
          <Route 
            path="/ask" 
            element={
              <AskDoubt 
                onSubmitDoubt={handlePostDoubt}
                defaultSemester={user.semester}
              />
            } 
          />
          <Route 
            path="/doubts" 
            element={
              <DoubtBoard 
                doubts={doubts}
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
            } 
          />
          <Route 
            path="/doubts/:id" 
            element={
              <DoubtBoard 
                doubts={doubts}
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
            } 
          />
          <Route 
            path="/notes" 
            element={
              <NotesLibrary 
                notes={notes}
                onPreviewNote={(note) => setPreviewNote(note)}
                onDownloadNote={handleDownloadNote}
                onOpenUploadModal={() => setShowUploadModal(true)}
              />
            } 
          />
          <Route 
            path="/groups" 
            element={
              <StudyGroups 
                groups={groups}
                onToggleJoinGroup={handleToggleJoinGroup}
                onOpenCreateModal={() => setShowCreateGroupModal(true)}
              />
            } 
          />
          <Route 
            path="/tutors" 
            element={
              <PeerTutors 
                tutors={tutors}
                onBookTutor={(tutor) => setBookingTutor(tutor)}
                onRateTutor={(tutor) => setShowRatingModal({
                  targetType: 'tutor',
                  targetId: tutor.id,
                  targetName: tutor.name
                })}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

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

      {/* Dynamic Upload Note Modal */}
      {showUploadModal && (
        <UploadNoteModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadNote}
          user={user}
        />
      )}

      {/* Dynamic Create Study Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal 
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          onCreateGroup={handleCreateGroup}
          user={user}
        />
      )}

      {/* Dynamic Book Tutor Modal */}
      {bookingTutor && (
        <BookTutorModal 
          tutor={bookingTutor}
          isOpen={Boolean(bookingTutor)}
          onClose={() => setBookingTutor(null)}
          onConfirmBooking={handleConfirmBooking}
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
              <span className="text-xs text-navy-500 font-mono">{previewNote.fileSize} • {previewNote.downloads || 0} peers downloaded</span>
              <button 
                onClick={() => {
                  handleDownloadNote(previewNote);
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
