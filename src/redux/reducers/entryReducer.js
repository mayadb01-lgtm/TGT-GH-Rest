import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  entries: [],
  loading: true,
  error: null,
};

const entryReducer = createReducer(initialState, (builder) => {
  builder
    // Create Entry
    .addCase("CreateEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateEntrySuccess", (state, action) => {
      state.loading = false;
      state.entries = [...state.entries, action.payload];
    })
    .addCase("CreateEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Get Entries
    .addCase("GetEntriesRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetEntriesSuccess", (state, action) => {
      state.loading = false;
      state.entries = action.payload;
    })
    .addCase("GetEntriesFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Update Entry
    .addCase("UpdateEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateEntrySuccess", (state, action) => {
      state.loading = false;
      state.entries = state.entries.map((entry) =>
        entry._id === action.payload._id ? action.payload : entry
      );
    })
    .addCase("UpdateEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Delete Entry
    .addCase("DeleteEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("DeleteEntrySuccess", (state, action) => {
      state.loading = false;
      state.entries = state.entries.filter(
        (entry) => entry._id !== action.payload
      );
    })
    .addCase("DeleteEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

export default entryReducer;
