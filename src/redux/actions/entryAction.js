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
