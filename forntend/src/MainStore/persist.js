const STORAGE_KEY = "irctc_sim_state_v1";

// Everything the app needs is kept in Redux state and mirrored into
// localStorage so a page refresh doesn't wipe the simulated "database".
// There is no backend/REST call anywhere in this app.
export const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (e) {
    return undefined;
  }
};

export const savePersistedState = (state) => {
  try {
    // Only persist the slices that represent "data", not transient UI state
    const toSave = {
      usersReducer: state.usersReducer,
      authReducer: { user: state.authReducer.user },
      trainsReducer: state.trainsReducer,
      paymentMethodsReducer: state.paymentMethodsReducer,
      passengersReducer: state.passengersReducer,
      bookingsReducer: state.bookingsReducer,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    // ignore quota errors
  }
};

export const clearPersistedState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
