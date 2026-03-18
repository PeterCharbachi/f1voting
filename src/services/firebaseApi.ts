import { auth, db } from '../firebase.ts';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
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

export interface AppUser {
  uid: string;
  email: string | null;
  username: string;
  role: 'user' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Helper to convert Firebase user to our app's user format
const formatUser = (user: any): AppUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    username: user.username || '',
    role: user.role || 'user',
  };
};

// --- Auth Functions ---
export const login = async (email: string, password: string): Promise<ApiResponse<AppUser>> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    const formattedUser = formatUser({ ...user, ...userData });
    if (!formattedUser) throw new Error('User formatting failed');

    return { success: true, data: formattedUser };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const register = async (email: string, password: string, username: string, role: 'user' | 'admin' = 'user'): Promise<ApiResponse<AppUser>> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      username: username,
      role: role,
    });

    const formattedUser = formatUser({ ...user, username, role });
    if (!formattedUser) throw new Error('User formatting failed');

    return { success: true, data: formattedUser };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logout = async (): Promise<ApiResponse<void>> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- User Management Functions ---
export const getAllUsers = async (): Promise<ApiResponse<AppUser[]>> => {
  try {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as AppUser[];
    return { success: true, data: userList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateUser = async (uid: string, updates: Partial<Omit<AppUser, 'uid'>>): Promise<ApiResponse<void>> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    return { success: true, message: 'Användare uppdaterad' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (uid: string): Promise<ApiResponse<void>> => {
  try {
    await deleteDoc(doc(db, 'users', uid));
    return { success: true, message: 'Användare borttagen' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- Vote Functions ---
export const submitVote = async (userId: string, raceId: string, prediction: string[]): Promise<ApiResponse<void>> => {
  try {
    const voteRef = doc(db, 'predictions', `${userId}-${raceId}`);
    await setDoc(voteRef, { userId, raceId, prediction }, { merge: true });
    return { success: true, message: 'Röst skickad' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Alias for admin usage
export const adminUpdateVote = submitVote;

export interface PredictionData {
    id: string;
    userId: string;
    raceId: string;
    prediction: string[];
}


export const getVotes = async (userId?: string): Promise<ApiResponse<PredictionData[]>> => {
  try {
    let votesQuery: Query<DocumentData> = collection(db, 'predictions');
    if (userId) {
      votesQuery = query(votesQuery, where('userId', '==', userId));
    }
    const voteSnapshot = await getDocs(votesQuery);
    const voteList = voteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PredictionData[];
    return { success: true, data: voteList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- Race Functions ---
export interface RaceData {
    id: string;
    name: string;
    date: string;
    result: string[] | null;
    year: number;
}

export const getRacesByYear = async (year: number): Promise<ApiResponse<RaceData[]>> => {
  try {
    const racesCol = collection(db, 'races');
    const q = query(racesCol, where('year', '==', year));
    const raceSnapshot = await getDocs(q);
    const raceList = raceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RaceData[];
    return { success: true, data: raceList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getDrivers = async (): Promise<ApiResponse<{id: string, name: string}[]>> => {
  try {
    const driversCol = collection(db, 'drivers');
    const driverSnapshot = await getDocs(driversCol);
    const driverList = driverSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {id: string, name: string}[];
    return { success: true, data: driverList };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
