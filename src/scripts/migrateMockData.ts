import 'dotenv/config';

import { db, auth, app, firebaseConfig } from '../firebase.js';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// --- Default mock users ---
const defaultMockUsers = [
    { email: "admin@f1voting.com", password: "admin123", role: "admin", uid: "adminUid" },
    { email: "charba@f1voting.com", password: "charba", role: "user", uid: "charbaUid" },
    { email: "testuser@f1voting.com", password: "testuser", role: "user", uid: "testuserUid" },
    { email: "user@f1voting.com", password: "user123", role: "user", uid: "userUid" },
];
// --- Default Data ---


const defaultRaces2026 = [
    { id: "2026-01", name: "Australian Grand Prix", date: "2026-03-08", result: null, year: 2026 },
    { id: "2026-02", name: "Chinese Grand Prix", date: "2026-03-15", result: null, year: 2026 },
    { id: "2026-03", name: "Japanese Grand Prix", date: "2026-03-29", result: null, year: 2026 },
    { id: "2026-04", name: "Bahrain Grand Prix", date: "2026-04-12", result: null, year: 2026 },
    { id: "2026-05", name: "Saudi Arabian Grand Prix", date: "2026-04-19", result: null, year: 2026 },
    { id: "2026-06", name: "Miami Grand Prix", date: "2026-05-03", result: null, year: 2026 },
    { id: "2026-07", name: "Monaco Grand Prix", date: "2026-06-07", result: null, year: 2026 },
    { id: "2026-08", name: "Barcelona Grand Prix", date: "2026-06-14", result: null, year: 2026 },
    { id: "2026-09", name: "Austrian Grand Prix", date: "2026-06-28", result: null, year: 2026 },
    { id: "2026-10", name: "British Grand Prix", date: "2026-07-05", result: null, year: 2026 },
    { id: "2026-11", name: "Belgian Grand Prix", date: "2026-07-19", result: null, year: 2026 },
    { id: "2026-12", name: "Hungarian Grand Prix", date: "2026-07-26", result: null, year: 2026 },
    { id: "2026-13", name: "Dutch Grand Prix", date: "2026-08-23", result: null, year: 2026 },
    { id: "2026-14", name: "Italian Grand Prix", date: "2026-09-06", result: null, year: 2026 },
    { id: "2026-15", name: "Spanish Grand Prix (Madrid)", date: "2026-09-13", result: null, year: 2026 },
    { id: "2026-16", name: "Azerbaijan Grand Prix", date: "2026-09-26", result: null, year: 2026 },
    { id: "2026-17", name: "Singapore Grand Prix", date: "2026-10-11", result: null, year: 2026 },
    { id: "2026-18", name: "United States Grand Prix", date: "2026-10-25", result: null, year: 2026 },
    { id: "2026-19", name: "Mexico City Grand Prix", date: "2026-11-01", result: null, year: 2026 },
    { id: "2026-20", name: "São Paulo Grand Prix", date: "2026-11-08", result: null, year: 2026 },
    { id: "2026-21", name: "Las Vegas Grand Prix", date: "2026-11-21", result: null, year: 2026 },
    { id: "2026-22", name: "Qatar Grand Prix", date: "2026-11-29", result: null, year: 2026 },
    { id: "2026-23", name: "Abu Dhabi Grand Prix", date: "2026-12-06", result: null, year: 2026 },
];
const defaultConstructors = [
    { id: "RB", name: "Red Bull Racing" },
    { id: "FER", name: "Ferrari" },
    { id: "MER", name: "Mercedes" },
    { id: "MCL", name: "McLaren" },
    { id: "AM", name: "Aston Martin" },
    { id: "ALP", name: "Alpine" },
    { id: "WIL", name: "Williams" },
    { id: "VCARB", name: "RB" },
    { id: "HAAS", name: "Haas F1 Team" },
    { id: "AUDI", name: "Audi" },
];
const defaultDrivers = [
    { id: "VER", name: "Max Verstappen" },
    { id: "HAD", name: "Isack Hadjar" },
    { id: "NOR", name: "Lando Norris" },
    { id: "PIA", name: "Oscar Piastri" },
    { id: "HAM", name: "Lewis Hamilton" },
    { id: "LEC", name: "Charles Leclerc" },
    { id: "RUS", name: "George Russell" },
    { id: "ANT", name: "Andrea Kimi Antonelli" },
    { id: "ALO", name: "Fernando Alonso" },
    { id: "STR", name: "Lance Stroll" },
    { id: "GAS", name: "Pierre Gasly" },
    { id: "OCO", name: "Esteban Ocon" },
    { id: "ALB", name: "Alexander Albon" },
    { id: "SAI", name: "Carlos Sainz" },
    { id: "BEA", name: "Oliver Bearman" },
    { id: "TSU", name: "Yuki Tsunoda" },
    { id: "LAW", name: "Liam Lawson" },
    { id: "HUL", name: "Nico Hulkenberg" },
    { id: "BOR", name: "Gabriel Bortoleto" },
    { id: "MAL", name: "Maloney Zane" },
];

const migrateData = async () => {
  try {
    // Sign in as admin user
    await signInWithEmailAndPassword(auth, 'admin@f1voting.com', 'admin123');
    console.log('Admin user signed in successfully.');
  } catch (error) {
    console.error('Error signing in admin user:', error);
    return; // Stop migration if admin sign-in fails
  }

  console.log('Starting data migration...');

  // --- Step 0: Cleanup ---
  console.log('\nStep 0: Cleaning up existing data (predictions, votes, races, drivers)...');
  const collectionsToClear = ['predictions', 'votes', 'races', 'drivers'];
  for (const colName of collectionsToClear) {
    const colRef = collection(db, colName);
    const snapshot = await getDocs(colRef);
    console.log(`  - Deleting ${snapshot.size} documents from ${colName}...`);
    // Iterate and delete sequentially or in small batches to avoid issues
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }
  }
  console.log('Cleanup complete.');

  // --- Verbose Logging ---
  console.log('Firebase Config being used:', firebaseConfig);
  console.log('Auth instance projectId:', app.options.projectId);
  // console.log('Firestore instance:', db); // This can be very verbose, uncomment if needed

  // --- UID Mapping ---
  // This map will store the mapping from mock UID (e.g., "adminUid") to the real Firebase Auth UID
  const uidMap: { [mockUid: string]: string } = {};

  // --- Step 1: Create Auth users and populate UID map ---
  console.log('Step 1: Creating Firebase Auth users...');
  for (const user of defaultMockUsers) {
    try {
      console.log(`Attempting to create auth user: ${user.email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const realUid = userCredential.user.uid;
      uidMap[user.uid] = realUid;
      console.log(`  - Success: ${user.email} created with real UID: ${realUid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.warn(`  - Warning: Auth user ${user.email} already exists.`);
        // If it's the admin we just signed in as, use that UID
        if (user.email === 'admin@f1voting.com' && auth.currentUser) {
          uidMap[user.uid] = auth.currentUser.uid;
          console.log(`  - Using current session UID for admin: ${auth.currentUser.uid}`);
        } else {
          uidMap[user.uid] = user.uid;
        }
      } else {
        console.error(`  - Error creating auth user ${user.email}: ${error.message}`);
      }
    }
  }
  console.log('Auth user creation process finished.');
  console.log('UID Map:', uidMap);


  // --- Step 2: Migrate Firestore 'users' collection ---
  console.log("\nStep 2: Migrating 'users' collection to Firestore...");
  for (const user of defaultMockUsers) {
      const realUid = uidMap[user.uid];
      if (!realUid) {
          console.error(`  - Error: No real UID found for mock UID ${user.uid}. Skipping Firestore document for ${user.email}.`);
          continue;
      }
      try {
          await setDoc(doc(db, 'users', realUid), { email: user.email, role: user.role });
          console.log(`  - Success: Created Firestore document for ${user.email} with real UID: ${realUid}`);
      } catch (error: any) {
          console.error(`  - Error creating Firestore document for ${user.email}: ${error.message}`);
      }
  }
  console.log("'users' collection migrated.");


  // --- Step 4: Migrate Races, Drivers, Constructors (no changes needed here) ---
  const mockRaces = [...defaultRaces2026];
  console.log('\nStep 4: Migrating races...');
  for (const race of mockRaces) {
    await setDoc(doc(db, 'races', race.id), race);
  }
  console.log('Races migrated.');

  console.log('\nMigrating drivers...');
  for (const driver of defaultDrivers) {
    await setDoc(doc(db, 'drivers', driver.id), driver);
  }
  console.log('Drivers migrated.');

  console.log('\nMigrating constructors...');
  for (const constructor of defaultConstructors) {
    await setDoc(doc(db, 'constructors', constructor.id), constructor);
  }
  console.log('Constructors migrated.');

  // --- Step 5: Final Admin Check ---
  console.log('\nStep 5: Ensuring admin@f1voting.com has correct role...');
  const adminUser = defaultMockUsers.find(u => u.email === 'admin@f1voting.com');
  if (adminUser) {
    const realAdminUid = uidMap[adminUser.uid];
    if (realAdminUid) {
      await setDoc(doc(db, 'users', realAdminUid), { 
        email: adminUser.email, 
        role: 'admin',
        username: 'Admin' 
      }, { merge: true });
      console.log(`  - Success: Admin role confirmed for ${adminUser.email}`);
    }
  }

  console.log('\nData migration complete!');
};

// --- Important cleanup instructions ---
console.log('---------------------------------------------------------------------');
console.log('IMPORTANT: For this script to work correctly, you should first:');
console.log('1. Delete all users from the Firebase Auth console.');
console.log('2. Delete the `users`, `votes`, `races`, `drivers`, and `constructors` collections from the Firestore console.');
console.log('---------------------------------------------------------------------');

migrateData().catch(error => {
    console.error("A critical error occurred during migration:", error);
});
