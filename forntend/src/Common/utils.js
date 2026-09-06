export const genId = (prefix = "ID") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;

export const genPNR = () => {
  let pnr = "";
  for (let i = 0; i < 10; i++) pnr += Math.floor(Math.random() * 10);
  return pnr;
};

// Simple deterministic string hash -> used to seed a PRNG so that
// "already booked by other passengers" looks stable per train/date/class/quota
// instead of randomly changing on every render.
export const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// mulberry32 seeded PRNG -> returns function producing [0,1)
export const seededRandom = (seed) => {
  let t = seed + 0x6d2b79f5;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const maskCardNumber = (num = "") => {
  const digits = num.replace(/\s+/g, "");
  if (digits.length < 4) return num;
  return `XXXX XXXX XXXX ${digits.slice(-4)}`;
};

export const maskUpi = (upi = "") => upi;

export const dayNameFromDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
};

export const todayISO = () => new Date().toISOString().slice(0, 10);
