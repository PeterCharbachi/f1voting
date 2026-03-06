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
  { username: "admin", email: "admin@f1voting.com", role: "admin" },
  { username: "charba", email: "charba@f1voting.com", role: "user" },
  { username: "testuser", email: "testuser@f1voting.com", role: "user" },
  { username: "user", email: "user@f1voting.com", role: "user" },
];

// --- Drivers (2026 Lineup) ---
const drivers = [
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
  { id: "AUDI", name: "Audi" },
];

// --- Races by year ---
const racesByYear: { [year: number]: any[] } = {
  2026: [
    { id: "2026-01", name: "Australian Grand Prix", date: "2026-03-08", result: null, year: 2026 },
    { id: "2026-02", name: "Chinese Grand Prix", date: "2026-03-15", result: null, year: 2026 },
    { id: "2026-03", name: "Japanese Grand Prix", date: "2026-03-29", result: null, year: 2026 },
  ],
};

const getRandomPrediction = (drivers: any[]): string[] => {
  const shuffled = [...drivers].sort(() => 0.5 - Math.random());
  const podium = shuffled.slice(0, 3).map(d => d.id);
  const pole = shuffled[Math.floor(Math.random() * shuffled.length)].id;
  return [...podium, pole];
};

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
  for (const u of users) {
      for (const r of racesByYear[2026]) {
          const v = {
              userId: u.username, // Using username as ID for this script's simplicity
              raceId: r.id,
              prediction: getRandomPrediction(drivers)
          };
          await db.collection("predictions").add(v);
      }
  }

  console.log("Seeding complete!");
}

seedAll().catch((err) => console.error(err));
