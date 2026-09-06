const draftInit = {
  train: null,
  date: null,
  classCode: null,
  quota: null,
  fare: null,
  quotaSeats: null,
  passengers: [],
  paymentMethodId: null,
};

export const draftBookingReducer = (state = draftInit, action) => {
  switch (action.type) {
    case "SELECT_TRAIN_CLASS":
      return {
        ...draftInit,
        train: action.payload.train,
        date: action.payload.date,
        classCode: action.payload.classCode,
        quota: action.payload.quota,
        fare: action.payload.fare,
        quotaSeats: action.payload.quotaSeats,
      };
    case "SET_DRAFT_PASSENGERS":
      return { ...state, passengers: action.payload };
    case "SET_DRAFT_PAYMENT":
      return { ...state, paymentMethodId: action.payload };
    case "RESET_DRAFT":
      return draftInit;
    default:
      return state;
  }
};

const bookingsInit = { list: [] };

export const bookingsReducer = (state = bookingsInit, action) => {
  switch (action.type) {
    case "CONFIRM_BOOKING_SUCCESS":
      return { ...state, list: [action.payload, ...state.list] };
    case "CANCEL_BOOKING_SUCCESS":
      return {
        ...state,
        list: state.list.map((b) =>
          b.pnr === action.payload ? { ...b, status: "CANCELLED" } : b
        ),
      };
    default:
      return state;
  }
};


let initialValues = {
  error: false,
  user: null,
  errMsg: ""
}

export const bookingTktReducer = (state = initialValues, action) => {
  switch (action.type) {
    case "BOOKING_TICKETS_SUCCESS":
      return state = {
        ...state,
        user: action.payload.data,
        error: false,
        errMsg: ""
      }
    case "BOOKING_TICKETS_FAILURE":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload
      }
    case "SET_ERR":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload.data.message?.[0]?.description
      }
    default:
      return state
  }
};

export const bookedTktsReducer = (state = initialValues, action) => {
  switch (action.type) {
    case "BOOKED_TICKETS":
      return state = {
        ...state,
        user: action.payload.data,
        error: false,
        errMsg: ""
      }
    case "BOOKING_TICKETS_FAILURE":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload
      }
    case "SET_ERR":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload.data.message?.[0]?.description
      }
    default:
      return state
  }
};

export const cancelTktsReducer = (state = initialValues, action) => {
  switch (action.type) {
    case "CANCEL_BOOKED_TICKETS":
      return state = {
        ...state,
        user: action.payload.data,
        error: false,
        errMsg: ""
      }
    case "BOOKING_TICKETS_FAILURE":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload
      }
    case "SET_ERR":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload.data.message?.[0]?.description
      }
    default:
      return state
  }
};

export const getQuotaReducer = (state = initialValues, action) => {
  switch (action.type) {
    case "GET_QUT_LIST":
      return state = {
        ...state,
        user: action.payload.data,
        error: false,
        errMsg: ""
      }
    case "BOOKING_TICKETS_FAILURE":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload
      }
    case "SET_ERR":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload.data.message?.[0]?.description
      }
    default:
      return state
  }
};

export const getClassesReducer = (state = initialValues, action) => {
  switch (action.type) {
    case "GET_CLS_LIST":
      return state = {
        ...state,
        user: action.payload.data,
        error: false,
        errMsg: ""
      }
    case "BOOKING_TICKETS_FAILURE":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload
      }
    case "SET_ERR":
      return state = {
        ...state,
        user: null,
        error: true,
        errMsg: action.payload.data.message?.[0]?.description
      }
    default:
      return state
  }
};
