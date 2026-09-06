import { genPNR } from "../../../Common/utils";
import { bookingTickets, getBookingTickets,cancelBookedTkt, getQuotas, getClasses } from "./restApi";

const delay = (ms = 900) => new Promise((res) => setTimeout(res, ms));

export const selectTrainClassAction = (payload) => ({
  type: "SELECT_TRAIN_CLASS",
  payload,
});

export const setDraftPassengersAction = (passengers) => ({
  type: "SET_DRAFT_PASSENGERS",
  payload: passengers,
});

export const setDraftPaymentAction = (paymentMethodId) => ({
  type: "SET_DRAFT_PAYMENT",
  payload: paymentMethodId,
});

export const resetDraftAction = () => ({ type: "RESET_DRAFT" });

// Simulated payment gateway. Fails only if a card number visibly ending in
// "0000" is used (or randomly ~8% of the time), otherwise succeeds - purely
// to demonstrate a failure path without needing a real gateway.
export const processMockPaymentAction = (paymentInfo) => {
  return async (dispatch) => {
    await delay(1200);
    const forcedFail =
      paymentInfo?.cardNumber && paymentInfo.cardNumber.endsWith("0000");
    const randomFail = Math.random() < 0.08;
    if (forcedFail || randomFail) {
      return { ok: false, transactionId: null, reason: "Payment declined by bank. Please try another method." };
    }
    return { ok: true, transactionId: `TXN${Date.now()}` };
  };
};

export const confirmBookingAction = (bookingDetails) => {
  return (dispatch) => {
    const booking = {
      pnr: genPNR(),
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      ...bookingDetails,
    };
    dispatch({ type: "CONFIRM_BOOKING_SUCCESS", payload: booking });
    return booking;
  };
};

export const cancelBookingAction = (pnr) => ({
  type: "CANCEL_BOOKING_SUCCESS",
  payload: pnr,
});


export const bookingTicketsAction = (creds) => {
    return async (dispatch) => {
        try {
            const bookingRes = await bookingTickets(creds);
            return dispatch({
                type: "BOOKING_TICKETS_SUCCESS",
                payload: bookingRes
            });
        }
        catch (error) {
            dispatch({
                type: "BOOKING_TICKETS_FAILURE",
                payload: error?.message || null
            });
        }
    }
};

export const bookedTicketsAction = (creds) => {
    return async (dispatch) => {
        try {
            const bookedTktRes = await getBookingTickets(creds);
            return dispatch({
                type: "BOOKED_TICKETS",
                payload: bookedTktRes
            });
        }
        catch (error) {
            dispatch({
                type: "BOOKED_TICKETS",
                payload: error?.message || null
            });
        }
    }
};

export const cancelBookingAct = (creds) => {
    return async (dispatch) => {
        try {
            const cancelBookedTktRes = await cancelBookedTkt(creds);
            return dispatch({
                type: "CANCEL_BOOKED_TICKETS",
                payload: cancelBookedTktRes
            });
        }
        catch (error) {
            dispatch({
                type: "CANCEL_BOOKED_TICKETS",
                payload: error?.message || null
            });
        }
    }
};

export const getQuotasAct = (creds) => {
    return async (dispatch) => {
        try {
            const getQuotaRes = await getQuotas(creds);
            return dispatch({
                type: "GET_QUT_LIST",
                payload: getQuotaRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_QUT_LIST",
                payload: error?.message || null
            });
        }
    }
};

export const getClassesAct = (creds) => {
    return async (dispatch) => {
        try {
            const getClassesRes = await getClasses(creds);
            return dispatch({
                type: "GET_CLS_LIST",
                payload: getClassesRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_CLS_LIST",
                payload: error?.message || null
            });
        }
    }
};