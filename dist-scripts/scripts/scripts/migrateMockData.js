import { db, auth, app, firebaseConfig } from '../firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// --- Default mock users ---
const defaultMockUsers = [
    { email: "admin@f1voting.com", password: "admin123", role: "admin", uid: "adminUid" },
    { email: "charba@f1voting.com", password: "charba", role: "user", uid: "charbaUid" },
    { email: "testuser@f1voting.com", password: "testuser", role: "user", uid: "testuserUid" },
    { email: "user@f1voting.com", password: "user123", role: "user", uid: "userUid" },
];
// --- Default Data ---
const defaultRaces2024 = [
    { id: "2024-1", name: "Bahrain Grand Prix", date: "2024-03-02", result: ["VER", "PER", "SAI"], year: 2024 },
    { id: "2024-2", name: "Saudi Arabian Grand Prix", date: "2024-03-09", result: ["VER", "PER", "LEC"], year: 2024 },
    { id: "2024-3", name: "Australian Grand Prix", date: "2024-03-24", result: ["SAI", "LEC", "NOR"], year: 2024 },
    { id: "2024-4", name: "Japanese Grand Prix", date: "2024-04-07", result: ["VER", "PER", "SAI"], year: 2024 },
    { id: "2024-5", name: "Chinese Grand Prix", date: "2024-04-21", result: ["VER", "NOR", "PER"], year: 2024 },
    { id: "2024-6", name: "Miami Grand Prix", date: "2024-05-05", result: ["NOR", "VER", "LEC"], year: 2024 },
    { id: "2024-7", name: "Emilia Romagna Grand Prix", date: "2024-05-19", result: ["VER", "NOR", "LEC"], year: 2024 },
    { id: "2024-8", name: "Monaco Grand Prix", date: "2024-05-26", result: ["LEC", "PIA", "SAI"], year: 2024 },
    { id: "2024-9", name: "Canadian Grand Prix", date: "2024-06-09", result: ["VER", "NOR", "RUS"], year: 2024 },
    { id: "2024-10", name: "Spanish Grand Prix", date: "2024-06-23", result: ["VER", "NOR", "HAM"], year: 2024 },
    { id: "2024-11", name: "Austrian Grand Prix", date: "2024-06-30", result: ["RUS", "PIA", "HAM"], year: 2024 },
    { id: "2024-12", name: "British Grand Prix", date: "2024-07-07", result: ["HAM", "VER", "NOR"], year: 2024 },
    { id: "2024-13", name: "Hungarian Grand Prix", date: "2024-07-21", result: ["PIA", "NOR", "HAM"], year: 2024 },
    { id: "2024-14", name: "Belgian Grand Prix", date: "2024-07-28", result: ["VER", "PIA", "LEC"], year: 2024 },
    { id: "2024-15", name: "Dutch Grand Prix", date: "2024-08-25", result: ["VER", "NOR", "LEC"], year: 2024 },
    { id: "2024-16", name: "Italian Grand Prix", date: "2024-09-01", result: ["LEC", "PIA", "RUS"], year: 2024 },
    { id: "2024-17", name: "Azerbaijan Grand Prix", date: "2024-09-15", result: ["RUS", "LEC", "VER"], year: 2024 },
    { id: "2024-18", name: "Singapore Grand Prix", date: "2024-09-22", result: ["NOR", "LEC", "PIA"], year: 2024 },
    { id: "2024-19", name: "United States Grand Prix", date: "2024-10-20", result: ["VER", "HAM", "LEC"], year: 2024 },
    { id: "2024-20", name: "Mexico City Grand Prix", date: "2024-10-27", result: ["PER", "VER", "SAI"], year: 2024 },
    { id: "2024-21", name: "São Paulo Grand Prix", date: "2024-11-03", result: ["HAM", "RUS", "NOR"], year: 2024 },
    { id: "2024-22", name: "Las Vegas Grand Prix", date: "2024-11-23", result: ["VER", "LEC", "PIA"], year: 2024 },
    { id: "2024-23", name: "Qatar Grand Prix", date: "2024-11-01", result: ["NOR", "VER", "RUS"], year: 2024 },
    { id: "2024-24", name: "Abu Dhabi Grand Prix", date: "2024-12-08", result: ["VER", "LEC", "HAM"], year: 2024 },
    { id: "2024-25", name: "South African Grand Prix", date: "2024-04-07", result: ["HAM", "VER", "RUS"], year: 2024 },
    { id: "2024-26", name: "French Grand Prix", date: "2024-07-28", result: ["VER", "LEC", "NOR"], year: 2024 },
];
const defaultRaces2025 = [
    { id: "2025-1", name: "Australian Grand Prix", date: "2025-03-16", result: ["VER", "LEC", "NOR"], year: 2025 },
    { id: "2025-2", name: "Bahrain Grand Prix", date: "2025-03-23", result: ["HAM", "RUS", "SAI"], year: 2025 },
    { id: "2025-3", name: "Saudi Arabian Grand Prix", date: "2025-03-30", result: ["VER", "PER", "LEC"], year: 2025 },
    { id: "2025-4", name: "Chinese Grand Prix", date: "2025-04-13", result: ["SAI", "LEC", "VER"], year: 2025 },
    { id: "2025-5", name: "Miami Grand Prix", date: "2025-05-04", result: ["NOR", "PIA", "RUS"], year: 2025 },
    { id: "2025-6", name: "Monaco Grand Prix", date: "2025-05-25", result: null, year: 2025 },
    { id: "2025-7", name: "Spanish Grand Prix", date: "2025-06-01", result: null, year: 2025 },
    { id: "2025-8", name: "Canadian Grand Prix", date: "2025-06-15", result: null, year: 2025 },
    { id: "2025-9", name: "Austrian Grand Prix", date: "2025-06-29", result: null, year: 2025 },
    { id: "2025-10", name: "British Grand Prix", date: "2025-07-06", result: null, year: 2025 },
    { id: "2025-11", name: "Belgian Grand Prix", date: "2025-07-27", result: null, year: 2025 },
    { id: "2025-12", name: "Hungarian Grand Prix", date: "2025-08-03", result: null, year: 2025 },
    { id: "2025-13", name: "Dutch Grand Prix", date: "2025-08-31", result: null, year: 2025 },
    { id: "2025-14", name: "Italian Grand Prix", date: "2025-09-07", result: null, year: 2025 },
    { id: "2025-15", name: "Singapore Grand Prix", date: "2025-09-21", result: null, year: 2025 },
    { id: "2025-16", name: "Japanese Grand Prix", date: "2025-09-28", result: null, year: 2025 },
    { id: "2025-17", name: "United States Grand Prix", date: "2025-10-19", result: null, year: 2025 },
    { id: "2025-18", name: "Mexico City Grand Prix", date: "2025-10-26", result: null, year: 2025 },
    { id: "2025-19", name: "São Paulo Grand Prix", date: "2025-11-09", result: null, year: 2025 },
    { id: "2025-20", name: "Las Vegas Grand Prix", date: "2025-11-22", result: null, year: 2025 },
    { id: "2025-21", name: "Qatar Grand Prix", date: "2025-11-30", result: null, year: 2025 },
    { id: "2025-22", name: "Abu Dhabi Grand Prix", date: "2025-12-07", result: null, year: 2025 },
    { id: "2025-23", name: "South African Grand Prix", date: "2025-04-06", result: null, year: 2025 },
    { id: "2025-24", name: "Azerbaijan Grand Prix", date: "2025-06-08", result: null, year: 2025 },
];
const defaultRaces2026 = [
    { id: "2026-1", name: "Future Grand Prix 1", date: "2026-03-01", result: null, year: 2026 },
    { id: "2026-2", name: "Future Grand Prix 2", date: "2026-03-08", result: null, year: 2026 },
    { id: "2026-3", name: "Future Grand Prix 3", date: "2026-03-15", result: null, year: 2026 },
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
    { id: "SAUB", name: "Sauber" },
];
const defaultDrivers = [
    { id: "VER", name: "Max Verstappen" },
    { id: "PER", name: "Sergio Perez" },
    { id: "HAM", name: "Lewis Hamilton" },
    { id: "RUS", name: "George Russell" },
    { id: "LEC", name: "Charles Leclerc" },
    { id: "SAI", name: "Carlos Sainz" },
    { id: "NOR", name: "Lando Norris" },
    { id: "PIA", name: "Oscar Piastri" },
    { id: "ALO", name: "Fernando Alonso" },
    { id: "STR", name: "Lance Stroll" },
    { id: "GAS", name: "Pierre Gasly" },
    { id: "OCO", name: "Esteban Ocon" },
    { id: "ALB", name: "Alexander Albon" },
    { id: "SAR", name: "Logan Sargeant" },
    { id: "RIC", name: "Daniel Ricciardo" },
    { id: "TSU", name: "Yuki Tsunoda" },
    { id: "BOT", name: "Valtteri Bottas" },
    { id: "ZHO", name: "Guanyu Zhou" },
    { id: "MAG", name: "Kevin Magnussen" },
    { id: "HUL", name: "Nico Hulkenberg" },
];
const defaultVotes = [
    // admin
    { userId: "adminUid", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "adminUid", raceId: "2025-1", prediction: ["LEC", "VER", "SAI"] },
    { userId: "adminUid", raceId: "2025-2", prediction: ["RUS", "HAM", "VER"] },
    // charba
    { userId: "charbaUid", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "charbaUid", raceId: "2025-1", prediction: ["VER", "NOR", "LEC"] },
    { userId: "charbaUid", raceId: "2025-2", prediction: ["HAM", "VER", "RUS"] },
    // testuser
    { userId: "testuserUid", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2025-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuserUid", raceId: "2025-2", prediction: ["HAM", "RUS", "SAI"] },
    // normal user
    { userId: "userUid", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "userUid", raceId: "2025-1", prediction: ["VER", "LEC", "NOR"] },
    { userId: "userUid", raceId: "2025-2", prediction: ["HAM", "RUS", "SAI"] },
];
const migrateData = async () => {
    console.log('Starting data migration...');
    // --- Verbose Logging ---
    console.log('Firebase Config being used:', firebaseConfig);
    console.log('Auth instance projectId:', app.options.projectId);
    // console.log('Firestore instance:', db); // This can be very verbose, uncomment if needed
    // --- UID Mapping ---
    // This map will store the mapping from mock UID (e.g., "adminUid") to the real Firebase Auth UID
    const uidMap = {};
    // --- Step 1: Create Auth users and populate UID map ---
    console.log('Step 1: Creating Firebase Auth users...');
    for (const user of defaultMockUsers) {
        try {
            console.log(`Attempting to create auth user: ${user.email}`);
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const realUid = userCredential.user.uid;
            uidMap[user.uid] = realUid;
            console.log(`  - Success: ${user.email} created with real UID: ${realUid}`);
        }
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.warn(`  - Warning: Auth user ${user.email} already exists. This can cause UID mismatches if Firestore is not clean. For a clean migration, delete users from Firebase Auth console first.`);
                // We can't get the UID for an existing user on the client-side without logging them in.
                // We'll add the mock UID to the map as a fallback, but this is not ideal.
                uidMap[user.uid] = user.uid;
            }
            else {
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
        }
        catch (error) {
            console.error(`  - Error creating Firestore document for ${user.email}: ${error.message}`);
        }
    }
    console.log("'users' collection migrated.");
    // --- Step 3: Migrate 'votes' collection ---
    console.log("\nStep 3: Migrating 'votes' collection to Firestore...");
    for (const vote of defaultVotes) {
        const realUserId = uidMap[vote.userId];
        if (!realUserId) {
            console.error(`  - Error: Could not find real UID for mock userId "${vote.userId}" in vote for race ${vote.raceId}. Skipping this vote.`);
            continue;
        }
        try {
            const voteId = `${realUserId}-${vote.raceId}`;
            const voteData = {
                userId: realUserId,
                raceId: vote.raceId,
                prediction: vote.prediction,
            };
            await setDoc(doc(db, 'votes', voteId), voteData);
            // console.log(`  - Success: Migrated vote for race ${vote.raceId} for user ${realUserId}.`); // Optional: uncomment for verbose logging
        }
        catch (error) {
            console.error(`  - Error migrating vote for race ${vote.raceId}: ${error.message}`);
        }
    }
    console.log("'votes' collection migrated.");
    // --- Step 4: Migrate Races, Drivers, Constructors (no changes needed here) ---
    const mockRaces = [...defaultRaces2024, ...defaultRaces2025, ...defaultRaces2026];
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
