import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import adminReducer from "./reducers/adminReducer";
import entryReducer from "./reducers/entryReducer";
import restEntryReducer from "./reducers/restEntryReducer";

const Store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    entry: entryReducer,
    restEntry: restEntryReducer,
  },
});

export default Store;
