import { hashString, seededRandom } from "../../../Common/utils";
import { QUOTA_SHARE } from "../../../Common/seedData";

// Returns the seat allocation for a given class+quota combination.
export const quotaSeatCount = (totalSeats, quota) => {
  return Math.max(1, Math.round(totalSeats * (QUOTA_SHARE[quota] ?? 0.1)));
};

// Deterministic "seats already taken by other simulated passengers" for a
// given train/date/class/quota, expressed as a fraction of that quota's seats.
export const baseOccupiedFraction = (trainId, date, classCode, quota) => {
  const seed = hashString(`${trainId}|${date}|${classCode}|${quota}`);
  const rand = seededRandom(seed);
  // occupancy generally between 25% and 95%
  return 0.25 + rand() * 0.7;
};

// bookingsForSlot = number of seats already booked within this app's own
// bookings state (from bookingsReducer) for this exact train/date/class/quota.
export const computeAvailability = (train, date, classCode, quota, bookingsForSlot = 0) => {
  const clsInfo = train.classes.find((c) => c.code === classCode);
  if (!clsInfo) return null;
  const quotaSeats = quotaSeatCount(clsInfo.totalSeats, quota);
  const occupiedFrac = baseOccupiedFraction(train.id, date, classCode, quota);
  const otherBooked = Math.floor(quotaSeats * occupiedFrac);
  const available = quotaSeats - otherBooked - bookingsForSlot;
  return {
    quotaSeats,
    fare: clsInfo.fare,
    available: Math.max(available, -20), // allow a small negative range to represent waitlist depth
    status: available > 0 ? "AVAILABLE" : available > -15 ? "WAITLIST" : "NOT_AVAILABLE",
  };
};
