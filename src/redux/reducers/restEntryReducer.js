import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  restEntries: [],
  loading: false,
  error: null,
};

const restEntryReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("CreateRestEntriesRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateRestEntriesSuccess", (state, action) => {
      state.loading = false;
      state.restEntries = [...state.restEntries, action.payload];
    })
    .addCase("CreateRestEntriesFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Get Entries By Date
    .addCase("GetRestEntriesByDateRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetRestEntriesByDateSuccess", (state, action) => {
      state.loading = false;
      state.restEntries = action.payload;
    })
    .addCase("GetRestEntriesByDateFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.restEntries = [];
    })
    // Update Entry
    .addCase("UpdateRestEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateRestEntrySuccess", (state, action) => {
      state.loading = false;
      state.restEntries = state.restEntries.map((entry) =>
        entry._id === action.payload._id ? action.payload : entry
      );
    })
    .addCase("UpdateRestEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

export default restEntryReducer;
