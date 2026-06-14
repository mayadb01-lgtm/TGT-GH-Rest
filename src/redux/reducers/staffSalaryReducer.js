import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  salarySheet: null,
  salarySheetNotFound: false,
  loading: false,
  error: null,
};

const staffSalaryReducer = createReducer(initialState, (builder) => {
  builder
    // Get Salary Sheet
    .addCase("GetSalarySheetRequest", (state) => {
      state.loading = true;
      state.salarySheetNotFound = false;
    })
    .addCase("GetSalarySheetSuccess", (state, action) => {
      state.loading = false;
      state.salarySheet = action.payload;
      state.salarySheetNotFound = false;
    })
    .addCase("GetSalarySheetNotFound", (state) => {
      state.loading = false;
      state.salarySheet = null;
      state.salarySheetNotFound = true;
    })
    .addCase("GetSalarySheetFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Create Salary Sheet
    .addCase("CreateSalarySheetRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateSalarySheetSuccess", (state, action) => {
      state.loading = false;
      state.salarySheet = action.payload;
      state.salarySheetNotFound = false;
    })
    .addCase("CreateSalarySheetFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Update Salary Sheet
    .addCase("UpdateSalarySheetRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateSalarySheetSuccess", (state, action) => {
      state.loading = false;
      state.salarySheet = action.payload;
    })
    .addCase("UpdateSalarySheetFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Delete Salary Sheet
    .addCase("DeleteSalarySheetRequest", (state) => {
      state.loading = true;
    })
    .addCase("DeleteSalarySheetSuccess", (state) => {
      state.loading = false;
      state.salarySheet = null;
    })
    .addCase("DeleteSalarySheetFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

export default staffSalaryReducer;
