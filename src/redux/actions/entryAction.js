import axios from "axios";
import toast from "react-hot-toast";

// Create Entry
export const createEntry = (entryData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateEntryRequest" });
    const { data } = await axios.post(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/entry/create-entry`,
      entryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Entry created successfully", data);
    dispatch({ type: "CreateEntrySuccess", payload: data.entry });
    toast.success("Entry created successfully");
  } catch (error) {
    dispatch({
      type: "CreateEntryFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Get Entries by Date
export const getEntriesByDate = (date) => async (dispatch) => {
  try {
    dispatch({ type: "GetEntriesRequest" });
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/entry/get-entry/${date}`
    );
    console.log("Entries fetched successfully", data);
    dispatch({ type: "GetEntriesSuccess", payload: data.data });
  } catch (error) {
    dispatch({
      type: "GetEntriesFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Update Entry by Date
export const updateEntryByDate = (date, entryData) => async (dispatch) => {
  try {
    dispatch({ type: "UpdateEntryRequest" });
    const { data } = await axios.put(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/entry/update-entry/${date}`,
      entryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Entry updated successfully", data);
    dispatch({ type: "UpdateEntrySuccess", payload: data.data });
    toast.success("Entry updated successfully");
  } catch (error) {
    dispatch({
      type: "UpdateEntryFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Get UnPaid Entries
export const getUnPaidEntries = () => async (dispatch) => {
  try {
    dispatch({ type: "GetUnPaidEntriesRequest" });
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/entry/get-unpaid-entries`
    );
    console.log("UnPaid Entries fetched successfully", data);
    dispatch({ type: "GetUnPaidEntriesSuccess", payload: data.data });
  } catch (error) {
    dispatch({
      type: "GetUnPaidEntriesFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Internal State Management
// 1. dayData - for setState of dayData
export const setDayData = (dayData) => (dispatch) => {
  try {
    dispatch({ type: "UpdateDayDataRequest" });
    dispatch({ type: "UpdateDayDataSuccess", payload: dayData });
  } catch (error) {
    dispatch({
      type: "UpdateDayDataFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
// 2. nightData
export const setNightData = (nightData) => (dispatch) => {
  try {
    dispatch({ type: "UpdateNightDataRequest" });
    dispatch({ type: "UpdateNightDataSuccess", payload: nightData });
  } catch (error) {
    dispatch({
      type: "UpdateNightDataFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
// 3. extraDayData
export const setExtraDayData = (extraDayData) => (dispatch) => {
  try {
    dispatch({ type: "UpdateExtraDayDataRequest" });
    dispatch({ type: "UpdateExtraDayDataSuccess", payload: extraDayData });
  } catch (error) {
    dispatch({
      type: "UpdateExtraDayDataFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
// 4. extraNightData
export const setExtraNightData = (extraNightData) => (dispatch) => {
  try {
    dispatch({ type: "UpdateExtraNightDataRequest" });
    dispatch({ type: "UpdateExtraNightDataSuccess", payload: extraNightData });
  } catch (error) {
    dispatch({
      type: "UpdateExtraNightDataFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
// 5. pendingJamaRows
export const setPendingJamaRows = (pendingJamaRows) => (dispatch) => {
  try {
    dispatch({ type: "UpdatePendingJamaRowsRequest" });
    dispatch({
      type: "UpdatePendingJamaRowsSuccess",
      payload: pendingJamaRows,
    });
  } catch (error) {
    dispatch({
      type: "UpdatePendingJamaRowsFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// 6. reservationData
export const setReservationData = (reservationData) => (dispatch) => {
  try {
    dispatch({ type: "UpdateReservationDataRequest" });
    dispatch({
      type: "UpdateReservationDataSuccess",
      payload: reservationData,
    });
  } catch (error) {
    dispatch({
      type: "UpdateReservationDataFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
// 7. setSelectDate
export const setSelectedDate = (selectDate) => (dispatch) => {
  try {
    dispatch({ type: "UpdateSelectDateRequest" });
    dispatch({ type: "UpdateSelectDateSuccess", payload: selectDate });
  } catch (error) {
    dispatch({
      type: "UpdateSelectDateFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
