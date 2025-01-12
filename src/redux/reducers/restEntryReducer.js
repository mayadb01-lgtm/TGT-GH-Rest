import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  restEntries: [],
  loading: true,
  error: null,
};

const restEntryReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("CreateRestEntriesRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateRestEntriesSuccess", (state, action) => {
      state.loading = false;
      state.entries = [...state.entries, action.payload];
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
    });
});

export default restEntryReducer;
