import { auth, db } from '../firebase.ts';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  type DocumentData
} from 'firebase/firestore';

// Helper to convert Firebase user to our app's user format
const formatUser = (user: any) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    username: user.username || '',
    role: user.role || 'user', // Default role to 'user' if not specified
  };
};

// --- Auth Functions ---
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return { success: true, user: formatUser({ ...user, ...userData }) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const register = async (email: string, password: string, username: string, role: string = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore, including role and username
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      username: username,
      role: role,
    });

    return { success: true, user: formatUser({ ...user, username, role }) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- User Management Functions ---
export const getAllUsers = async () => {
  try {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    return { success: true, data: userList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateUser = async (uid: string, updates: { email?: string, password?: string, role?: string }) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    return { success: true, message: 'User updated successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (uid: string) => {
  try {
    await deleteDoc(doc(db, 'users', uid));
    // TODO: Also delete user from Firebase Auth if needed, but this requires admin SDK or callable function
    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- Vote Functions ---
export const submitVote = async (userId: string, raceId: string, prediction: string[]) => {
  try {
    const voteRef = doc(db, 'predictions', `${userId}-${raceId}`);
    await setDoc(voteRef, { userId, raceId, prediction }, { merge: true });
    return { success: true, message: 'Vote submitted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getVotes = async (userId?: string) => {
  try {
    let votesQuery: Query<DocumentData> = collection(db, 'predictions');
    if (userId) {
      votesQuery = query(votesQuery, where('userId', '==', userId));
    }
    const voteSnapshot = await getDocs(votesQuery);
    const voteList = voteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: voteList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const adminUpdateVote = async (userId: string, raceId: string, newPrediction: string[]) => {
  try {
    const voteRef = doc(db, 'predictions', `${userId}-${raceId}`);
    await updateDoc(voteRef, { prediction: newPrediction });
    return { success: true, message: 'Vote updated successfully by admin.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- Race Functions ---
export const getRacesByYear = async (year: number) => {
  try {
    const racesCol = collection(db, 'races');
    const q = query(racesCol, where('year', '==', year));
    const raceSnapshot = await getDocs(q);
    const raceList = raceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: raceList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateRaceResultByYear = async (year: number, raceId: string, newResult: string[]) => {
  try {
    // Find the specific race document
    const racesCol = collection(db, 'races');
    const q = query(racesCol, where('year', '==', year), where('id', '==', raceId));
    const raceSnapshot = await getDocs(q);

    if (raceSnapshot.empty) {
      return { success: false, message: 'Race not found for the specified year.' };
    }

    const raceDoc = raceSnapshot.docs[0];
    await updateDoc(raceDoc.ref, { result: newResult });
    return { success: true, message: 'Race result updated successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getRaces = async () => {
  try {
    const currentYear = 2026;
    const racesCol = collection(db, 'races');
    const q = query(racesCol, where('year', '==', currentYear));
    const raceSnapshot = await getDocs(q);
    const raceList = raceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: raceList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- Drivers and Constructors (assuming these are static or managed separately) ---
// For now, we'll assume these might be loaded once or managed via admin.
// If they need to be dynamic, similar Firestore functions would be needed.
export const getDrivers = async () => {
  try {
    const driversCol = collection(db, 'drivers');
    const driverSnapshot = await getDocs(driversCol);
    const driverList = driverSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: driverList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getConstructors = async () => {
  try {
    const constructorsCol = collection(db, 'constructors');
    const constructorSnapshot = await getDocs(constructorsCol);
    const constructorList = constructorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: constructorList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
