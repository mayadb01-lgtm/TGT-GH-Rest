import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import adminReducer from "./reducers/adminReducer";

const Store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export default Store;
