import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import { db } from '../firebase.ts';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import type { AppUser, RaceData, PredictionData } from '../services/firebaseApi';

interface Driver {
  id: string;
  name: string;
}

interface Constructor {
  id: string;
  name: string;
}

// Define a type for the vote that RaceCard expects
interface UserVote {
    raceId: string;
    prediction: string[];
}

interface DataContextType {
  users: AppUser[];
  races: RaceData[];
  predictions: PredictionData[];
  drivers: Driver[];
  constructors: Constructor[];
  userVotes: UserVote[];
  loading: boolean;
  currentSeason: number;
  setCurrentSeason: (season: number) => void;
  updateUser: (userId: string, updates: Partial<Omit<AppUser, 'uid'>>) => Promise<void>;
  addRace: (race: Omit<RaceData, 'id'>) => Promise<void>;
  updateRace: (raceId: string, updates: Partial<RaceData>) => Promise<void>;
  deleteRace: (raceId: string) => Promise<void>;
  submitVote: (raceId: string, prediction: string[]) => Promise<void>;
  updateRaceResult: (raceId: string, result: string[]) => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (driverId: string, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (driverId: string) => Promise<void>;
  addConstructor: (constructor: Omit<Constructor, 'id'>) => Promise<void>;
  updateConstructor: (constructorId: string, updates: Partial<Constructor>) => Promise<void>;
  deleteConstructor: (constructorId: string) => Promise<void>;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser: user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [races, setRaces] = useState<RaceData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState(2026);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersSnap, racesSnap, predsSnap, driversSnap, constructorsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'races')),
          getDocs(collection(db, 'predictions')),
          getDocs(collection(db, 'drivers')),
          getDocs(collection(db, 'constructors')),
        ]);
        setUsers(usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as AppUser[]);
        setRaces(racesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RaceData[]);
        setPredictions(predsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PredictionData[]);
        setDrivers(driversSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Driver[]);
        setConstructors(constructorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Constructor[]);
      } catch (error) {
        console.error("DataContext: Fel vid hämtning av data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userVotes = useMemo(() => {
    if (!user) return [];
    return predictions
      .filter(p => p.userId === user.uid)
      .map(p => ({ raceId: p.raceId, prediction: p.prediction }));
  }, [predictions, user]);


  const submitVote = async (raceId: string, prediction: string[]) => {
    if (!user) throw new Error("Användaren är inte inloggad.");

    const existingVote = predictions.find(p => p.userId === user.uid && p.raceId === raceId);

    if (existingVote) {
      const voteRef = doc(db, 'predictions', existingVote.id);
      await updateDoc(voteRef, { prediction });
      setPredictions(prev => prev.map(p => p.id === existingVote.id ? { ...p, prediction } : p));
    } else {
      const newVote = {
        userId: user.uid,
        raceId: raceId,
        prediction,
      };
      const docRef = await addDoc(collection(db, 'predictions'), newVote);
      setPredictions(prev => [...prev, { ...newVote, id: docRef.id }]);
    }
  };

  const updateUser = async (userId: string, updates: Partial<Omit<AppUser, 'uid'>>) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    setUsers(prev => prev.map(u => u.uid === userId ? { ...u, ...updates } : u));
  };

  const addRace = async (race: Omit<RaceData, 'id'>) => {
    const docRef = await addDoc(collection(db, 'races'), race);
    setRaces(prev => [...prev, { ...race, id: docRef.id } as RaceData]);
  };

  const updateRace = async (raceId: string, updates: Partial<RaceData>) => {
    const raceRef = doc(db, 'races', raceId);
    await updateDoc(raceRef, updates);
    setRaces(prev => prev.map(r => r.id === raceId ? { ...r, ...updates } : r));
  };

  const deleteRace = async (raceId: string) => {
    await deleteDoc(doc(db, 'races', raceId));
    setRaces(prev => prev.filter(r => r.id !== raceId));
  };

  const addDriver = async (driver: Omit<Driver, 'id'>) => {
    const docRef = await addDoc(collection(db, 'drivers'), driver);
    setDrivers(prev => [...prev, { ...driver, id: docRef.id }]);
  };

  const updateDriver = async (driverId: string, updates: Partial<Driver>) => {
    const driverRef = doc(db, 'drivers', driverId);
    await updateDoc(driverRef, updates);
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, ...updates } : d));
  };

  const deleteDriver = async (driverId: string) => {
    await deleteDoc(doc(db, 'drivers', driverId));
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const addConstructor = async (constructor: Omit<Constructor, 'id'>) => {
    const docRef = await addDoc(collection(db, 'constructors'), constructor);
    setConstructors(prev => [...prev, { ...constructor, id: docRef.id }]);
  };

  const updateConstructor = async (constructorId: string, updates: Partial<Constructor>) => {
    const constructorRef = doc(db, 'constructors', constructorId);
    await updateDoc(constructorRef, updates);
    setConstructors(prev => prev.map(c => c.id === constructorId ? { ...c, ...updates } : c));
  };

  const deleteConstructor = async (constructorId: string) => {
    await deleteDoc(doc(db, 'constructors', constructorId));
    setConstructors(prev => prev.filter(c => c.id !== constructorId));
  };

  const updateRaceResult = async (raceId: string, result: string[]) => {
    const raceRef = doc(db, 'races', raceId);
    await updateDoc(raceRef, { result });
    setRaces(prev => prev.map(r => r.id === raceId ? { ...r, result } : r));
  };

  const value = useMemo(() => ({
    users, races, predictions, drivers, constructors, userVotes, loading, currentSeason,
    setCurrentSeason, updateUser, addRace, updateRace, deleteRace, submitVote, updateRaceResult,
    addDriver, updateDriver, deleteDriver, addConstructor, updateConstructor, deleteConstructor
  }), [users, races, predictions, drivers, constructors, userVotes, loading, currentSeason]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
