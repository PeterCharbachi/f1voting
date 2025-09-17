import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase.ts';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AppUser {
  uid: string;
  email: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  currentUser: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean; // Added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("AuthProvider: Current loading state:", loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthProvider: onAuthStateChanged fired. User:", user ? user.uid : "null");
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          role: (userData?.role as 'user' | 'admin') || 'user',
        });
      } else {
        setCurrentUser(null);
      }
      console.log("AuthProvider: Setting loading to false.");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login: Starting signInWithEmailAndPassword...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Login: signInWithEmailAndPassword successful. User UID:", user.uid);

    console.log("Login: Fetching user document from Firestore...");
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    console.log("Login: User document fetched. Exists:", userDoc.exists, "Data:", userData);

    console.log("Login: Setting current user state...");
    setCurrentUser({
      uid: user.uid,
      email: user.email,
      role: (userData?.role as 'user' | 'admin') || 'user',
    });
    console.log("Login: setCurrentUser successful.");
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null); // Clear user on logout
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'user', // Default role for new users
    });
    setCurrentUser({
      uid: user.uid,
      email: user.email,
      role: 'user',
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!currentUser, // Added
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
