// Simulated "database" seed. In a real IRCTC-like system this would come
// from a backend. Here, it is just the initial Redux state.

export const CLASS_CODES = ["SL", "3A", "2A", "1A", "CC"];

export const CLASS_LABELS = {
  SL: "Sleeper",
  "3A": "AC 3 Tier",
  "2A": "AC 2 Tier",
  "1A": "AC First Class",
  "CC": "AC Chair Car",
};

export const QUOTAS = ["GENERAL", "TATKAL", "LADIES", "SR_CITIZEN"];

export const QUOTA_LABELS = {
  GENERAL: "General",
  TATKAL: "Tatkal",
  LADIES: "Ladies",
  SR_CITIZEN: "Senior Citizen",
};

export const QUOTA_SHARE = {
  GENERAL: 0.7,
  TATKAL: 0.15,
  LADIES: 0.1,
  SR_CITIZEN: 0.05,
};

export const BERTH_PREFS = ["No Preference", "Lower", "Middle", "Upper", "Side Lower", "Side Upper"];

export const seedTrains = [
  {
    id: "TRN-12951",
    trainNo: "12951",
    trainName: "Mumbai Rajdhani Express",
    source: "New Delhi",
    destination: "Mumbai Central",
    departureTime: "16:25",
    arrivalTime: "08:35",
    duration: "16h 10m",
    runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { code: "3A", fare: 2150, totalSeats: 64 },
      { code: "2A", fare: 3080, totalSeats: 46 },
      { code: "1A", fare: 5200, totalSeats: 18 },
    ],
  },
  {
    id: "TRN-12301",
    trainNo: "12301",
    trainName: "Howrah Rajdhani Express",
    source: "New Delhi",
    destination: "Howrah Jn",
    departureTime: "17:00",
    arrivalTime: "10:05",
    duration: "17h 05m",
    runDays: ["Mon", "Wed", "Fri", "Sun"],
    classes: [
      { code: "SL", fare: 850, totalSeats: 200 },
      { code: "3A", fare: 2050, totalSeats: 64 },
      { code: "2A", fare: 2950, totalSeats: 46 },
    ],
  },
  {
    id: "TRN-12639",
    trainNo: "12639",
    trainName: "Brindavan Express",
    source: "Chennai Central",
    destination: "Bengaluru City Jn",
    departureTime: "07:50",
    arrivalTime: "13:00",
    duration: "05h 10m",
    runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { code: "CC", fare: 480, totalSeats: 120 },
      { code: "SL", fare: 190, totalSeats: 200 },
    ],
  },
  {
    id: "TRN-12009",
    trainNo: "12009",
    trainName: "Shatabdi Express",
    source: "Mumbai Central",
    destination: "Ahmedabad Jn",
    departureTime: "06:25",
    arrivalTime: "12:10",
    duration: "05h 45m",
    runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    classes: [
      { code: "CC", fare: 720, totalSeats: 150 },
      { code: "2A", fare: 1350, totalSeats: 46 },
    ],
  },
  {
    id: "TRN-22691",
    trainNo: "22691",
    trainName: "Rajdhani Express",
    source: "Bengaluru City Jn",
    destination: "New Delhi",
    departureTime: "20:00",
    arrivalTime: "05:30",
    duration: "33h 30m",
    runDays: ["Tue", "Thu", "Sat"],
    classes: [
      { code: "3A", fare: 3200, totalSeats: 64 },
      { code: "2A", fare: 4550, totalSeats: 46 },
      { code: "1A", fare: 7500, totalSeats: 18 },
    ],
  },
  {
    id: "TRN-12841",
    trainNo: "12841",
    trainName: "Coromandel Express",
    source: "Howrah Jn",
    destination: "Chennai Central",
    departureTime: "14:50",
    arrivalTime: "19:15",
    duration: "28h 25m",
    runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { code: "SL", fare: 780, totalSeats: 200 },
      { code: "3A", fare: 2010, totalSeats: 64 },
      { code: "2A", fare: 2870, totalSeats: 46 },
    ],
  },
];

// One seeded admin so the admin area is reachable without a signup step.
export const seedAdminUser = {
  id: "ADMIN-0001",
  userName: "admin",
  email: "admin@irctc-sim.local",
  mobile: "9999999999",
  password: "Admin@123",
  role: "ADMIN",
};

export const STATIONS = Array.from(
  new Set(
    seedTrains.flatMap((t) => [t.source, t.destination])
  )
).sort();
