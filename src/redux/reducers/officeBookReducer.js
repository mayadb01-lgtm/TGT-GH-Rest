import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  officeBook: [],
  loading: false,
  error: null,
};

export const officeBookReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("CreateOfficeEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateOfficeEntrySuccess", (state, action) => {
      state.loading = false;
      state.officeBook = [...state.officeBook, action.payload];
    })
    .addCase("CreateOfficeEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Get Entries by Date
    .addCase("GetOfficeBookByDateRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetOfficeBookByDateSuccess", (state, action) => {
      state.loading = false;
      state.officeBook = action.payload;
    })
    .addCase("GetOfficeBookByDateFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.officeBook = [];
    })
    // Update Entry by Date
    .addCase("UpdateOfficeEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateOfficeEntrySuccess", (state, action) => {
      state.loading = false;
      state.officeBook = action.payload;
    })
    .addCase("UpdateOfficeEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Delete Entry by Date
    .addCase("DeleteOfficeEntryRequest", (state) => {
      state.loading = true;
    })
    .addCase("DeleteOfficeEntrySuccess", (state, action) => {
      state.loading = false;
      state.officeBook = action.payload;
    })
    .addCase("DeleteOfficeEntryFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Get Entries by Date Range
    .addCase("GetOfficeBookByDateRangeRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetOfficeBookByDateRangeSuccess", (state, action) => {
      state.loading = false;
      state.officeBook = action.payload;
    })
    .addCase("GetOfficeBookByDateRangeFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.officeBook = [];
    });
});

export default officeBookReducer;
