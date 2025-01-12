import axios from "axios";
import toast from "react-hot-toast";

// Create Restaurant Entry
export const createRestEntry = (restEntryData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateRestEntriesRequest" });
    const { data } = await axios.post(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/restEntry/create-entry`,
      restEntryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Rest Entry created successfully", data);
    dispatch({ type: "CreateRestEntriesSuccess", payload: data.entry });
    toast.success("Rest Entry created successfully");
  } catch (error) {
    dispatch({
      type: "CreateRestEntriesFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Get Restaurant Entry by Date
export const getRestEntryByDate = (date) => async (dispatch) => {
  try {
    dispatch({ type: "GetRestEntriesByDateRequest" });
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/restEntry/get-entry/${date}`
    );
    console.log("Rest Entries fetched successfully", data);
    dispatch({ type: "GetRestEntriesByDateSuccess", payload: data.data });
  } catch (error) {
    dispatch({
      type: "GetRestEntriesByDateFailure",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};
