import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAdminAuthenticated: false,
  loading: true,
  admin: null,
  error: null,
};

const adminReducer = createReducer(initialState, (builder) => {
  builder
    // Create Admin
    .addCase("CreateAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateAdminSuccess", (state, action) => {
      state.loading = false;
      state.isAdminAuthenticated = true;
      state.admin = action.payload;
    })
    .addCase("CreateAdminFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdminAuthenticated = false;
    })
    // Login Admin
    .addCase("LoginAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoginAdminSuccess", (state, action) => {
      state.loading = false;
      state.isAdminAuthenticated = true;
      state.admin = action.payload;
    })
    .addCase("LoginAdminFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdminAuthenticated = false;
    })
    // Load Admin
    .addCase("LoadAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadAdminSuccess", (state, action) => {
      state.loading = false;
      state.admin = action.payload;
      state.isAdminAuthenticated = true;
    })
    .addCase("LoadAdminFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdminAuthenticated = false;
    })
    // Log out Admin
    .addCase("LogoutAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("LogoutAdminSuccess", (state) => {
      state.loading = false;
      state.isAdminAuthenticated = false;
      state.admin = null;
    })
    .addCase("LogoutAdminFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdminAuthenticated = true;
    });
});

export default adminReducer;
