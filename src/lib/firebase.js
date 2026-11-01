import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCFMMQ5qYLpj4iE5Ai_jjbIVB0Ymju55Q0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "student-study-app-21749.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "student-study-app-21749",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "student-study-app-21749.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "747098809686",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:747098809686:web:abadd1b9da67780a7f62f7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XHFE7EZC1D"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const isConfigured = isFirebaseConfigured;
export const isSupabaseConnected = () => isFirebaseConfigured; // Backward-compatible alias

// ==========================================
// 100% FIREBASE CLOUD DATABASE SERVICES
// ==========================================

export const cloudAuth = {
  // Sign up new student on Firebase
  async signUp(email, password, studentData) {
    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // 2. Set Firebase Auth display name & photo
    await updateProfile(user, {
      displayName: studentData.name,
      photoURL: studentData.avatar || `https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80`
    }).catch(() => {});

    // 3. Save student profile to Cloud Firestore 'profiles' collection
    const profile = {
      id: user.uid,
      name: studentData.name,
      email: email.trim(),
      uid: studentData.uid,
      college: studentData.college,
      course: studentData.course,
      semester: studentData.semester,
      subjects: studentData.subjects || [],
      points: 100,
      avatar: studentData.avatar || `https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80`,
      doubtsCount: 0,
      answersCount: 0,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'profiles', user.uid), profile);

    return { user, profile };
  },

  // Sign in existing student
  async signIn(emailOrUid, password) {
    const input = emailOrUid.trim();

    // Check if input is a Roll No / UID (e.g. STD-2025-XXXX)
    let emailToUse = input;
    if (!input.includes('@')) {
      const q = query(collection(db, 'profiles'));
      const snapshot = await getDocs(q);
      let foundProfile = null;
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.uid && data.uid.toLowerCase() === input.toLowerCase()) {
          foundProfile = data;
        }
      });
      if (foundProfile && foundProfile.email) {
        emailToUse = foundProfile.email;
      } else {
        throw new Error(`Student UID "${input}" not found. Please sign in with your email or register.`);
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
    const user = userCredential.user;

    // Fetch profile document from Firestore
    const docRef = doc(db, 'profiles', user.uid);
    const docSnap = await getDoc(docRef);
    let profile = docSnap.exists() ? docSnap.data() : null;

    if (!profile) {
      profile = {
        id: user.uid,
        name: user.displayName || input.split('@')[0],
        email: user.email,
        uid: `STD-${user.uid.substring(0, 5).toUpperCase()}`,
        college: "Apex Institute of Eng & Tech",
        course: "Engineering",
        semester: "Semester 2",
        subjects: ["Maths", "C Programming", "Physics"],
        points: 100,
        avatar: user.photoURL || `https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80`
      };
      await setDoc(docRef, profile).catch(() => {});
    }

    return { user, profile };
  },

  // Sign out
  async signOut() {
    await fbSignOut(auth);
  },

  // Auth State Listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'profiles', user.uid));
          const profile = docSnap.exists() ? docSnap.data() : null;
          callback('SIGNED_IN', { user, profile });
        } catch {
          callback('SIGNED_IN', { user, profile: null });
        }
      } else {
        callback('SIGNED_OUT', null);
      }
    });
  }
};

// Cloud Doubts Service in Firestore
export const cloudDoubts = {
  async fetchAll() {
    try {
      const q = query(collection(db, 'doubts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() });
      });
      return list;
    } catch (err) {
      console.warn("Firestore fetchAll doubts error:", err);
      // Fallback query without orderBy if index is creating
      try {
        const snapshot = await getDocs(collection(db, 'doubts'));
        const list = [];
        snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list;
      } catch {
        return [];
      }
    }
  },

  async create(doubt) {
    const docRef = await addDoc(collection(db, 'doubts'), {
      ...doubt,
      createdAt: new Date().toISOString(),
      answers: [],
      views: 1
    });
    return { id: docRef.id, ...doubt };
  },

  async addAnswer(doubtId, answer) {
    const doubtRef = doc(db, 'doubts', doubtId);
    const doubtSnap = await getDoc(doubtRef);
    if (doubtSnap.exists()) {
      const currentAnswers = doubtSnap.data().answers || [];
      const updatedAnswers = [...currentAnswers, answer];
      await updateDoc(doubtRef, { answers: updatedAnswers });
    }
  },

  async upvoteAnswer(doubtId, answerId, newCount) {
    const doubtRef = doc(db, 'doubts', doubtId);
    const doubtSnap = await getDoc(doubtRef);
    if (doubtSnap.exists()) {
      const currentAnswers = doubtSnap.data().answers || [];
      const updatedAnswers = currentAnswers.map(a => a.id === answerId ? { ...a, upvotes: newCount } : a);
      await updateDoc(doubtRef, { answers: updatedAnswers });
    }
  },

  async markBestAnswer(doubtId, answerId) {
    const doubtRef = doc(db, 'doubts', doubtId);
    const doubtSnap = await getDoc(doubtRef);
    if (doubtSnap.exists()) {
      const currentAnswers = doubtSnap.data().answers || [];
      const updatedAnswers = currentAnswers.map(a => ({
        ...a,
        isBestAnswer: a.id === answerId
      }));
      await updateDoc(doubtRef, { 
        answers: updatedAnswers,
        bestAnswerFlag: true 
      });
    }
  }
};

// Cloud Notes Service in Firestore
export const cloudNotes = {
  async fetchAll() {
    try {
      const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch {
      try {
        const snapshot = await getDocs(collection(db, 'notes'));
        const list = [];
        snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list;
      } catch {
        return [];
      }
    }
  },

  async create(note) {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: new Date().toISOString(),
      downloads: 0
    });
    return { id: docRef.id, ...note };
  },

  async incrementDownload(noteId, newCount) {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, { downloads: newCount });
    } catch (err) {
      console.warn("Firestore increment download note:", err);
    }
  }
};

// Cloud Study Groups Service in Firestore
export const cloudGroups = {
  async fetchAll() {
    try {
      const snapshot = await getDocs(collection(db, 'study_groups'));
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch {
      return [];
    }
  },

  async toggleJoin(groupId, newCount) {
    try {
      const groupRef = doc(db, 'study_groups', groupId);
      await updateDoc(groupRef, { membersCount: newCount });
    } catch (err) {
      console.warn("Firestore toggle join group:", err);
    }
  }
};

// Backward compatibility helpers
export const fetchDatabaseStats = async () => {
  try {
    const [pSnap, dSnap, nSnap] = await Promise.all([
      getDocs(collection(db, 'profiles')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'doubts')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'notes')).catch(() => ({ size: 0 }))
    ]);
    return {
      profiles: pSnap.size || 0,
      doubts: dSnap.size || 0,
      answers: 0,
      notes: nSnap.size || 0
    };
  } catch {
    return { profiles: 0, doubts: 0, answers: 0, notes: 0 };
  }
};

export const getSupabaseCredentials = () => ({
  url: "Firebase Project: student-study-app-21749",
  key: "Cloud Firestore & Firebase Auth Connected"
});
