// seedAll.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

// --- Users ---
const users = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "charba", password: "charba", role: "user" },
  { username: "testuser", password: "testuser", role: "user" },
  { username: "user", password: "user", role: "user" },
];

// --- Drivers ---
const drivers = [
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

// --- Constructors ---
const constructors = [
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

// --- Races by year ---
const racesByYear: { [year: number]: any[] } = {
  2024: [
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
  ],
  2025: [
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
  ],
  2026: [
    { id: "2026-1", name: "Future Grand Prix 1", date: "2026-03-01", result: null, year: 2026 },
    { id: "2026-2", name: "Future Grand Prix 2", date: "2026-03-08", result: null, year: 2026 },
    { id: "2026-3", name: "Future Grand Prix 3", date: "2026-03-15", result: null, year: 2026 },
  ],
};

// --- Votes ---
// Här är ett exempel på fulla votes, du kan expandera alla från mockapi.ts
const votes = [
   { userId: "admin", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "admin", raceId: "2025-1", prediction: ["LEC", "VER", "SAI"] },
    { userId: "admin", raceId: "2025-2", prediction: ["RUS", "HAM", "VER"] },
    // charba
    { userId: "charba", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "charba", raceId: "2025-1", prediction: ["VER", "NOR", "LEC"] },
    { userId: "charba", raceId: "2025-2", prediction: ["HAM", "VER", "RUS"] },
    // testuser
    { userId: "testuser", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2025-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "testuser", raceId: "2025-2", prediction: ["HAM", "RUS", "SAI"] },
    // normal user
    { userId: "user", raceId: "2024-1", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-10", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-11", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-12", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-13", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-14", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-15", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-16", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-17", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-18", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-19", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-2", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-20", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-21", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-22", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-23", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-24", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-25", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-26", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-3", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-4", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-5", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-6", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-7", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-8", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2024-9", prediction: ["VER", "PER", "LEC"] },
    { userId: "user", raceId: "2025-1", prediction: ["VER", "LEC", "NOR"] },
    { userId: "user", raceId: "2025-2", prediction: ["HAM", "RUS", "SAI"] },
  // … fortsätt med alla votes från mockapi.ts
];

// --- Seed Function ---
async function seedAll() {
  console.log("Seeding users...");
  for (const u of users) await db.collection("users").doc(u.username).set(u);

  console.log("Seeding drivers...");
  for (const d of drivers) await db.collection("drivers").doc(d.id).set(d);

  console.log("Seeding constructors...");
  for (const c of constructors) await db.collection("constructors").doc(c.id).set(c);

  console.log("Seeding races...");
  for (const year in racesByYear) {
    for (const r of racesByYear[year]) await db.collection("races").doc(r.id).set(r);
  }

  console.log("Seeding votes...");
  for (const v of votes) await db.collection("votes").add(v);

  console.log("Seeding complete!");
}

seedAll().catch((err) => console.error(err));
