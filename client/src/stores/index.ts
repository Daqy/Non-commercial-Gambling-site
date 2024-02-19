import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./user";
import auth from "./auth";

// export default configureStore({
//
// });

// const reducers = {
//   user,
//   auth,
// };

// import userReducer from "./slices/userSlice";

// import userReducer from "./slices/userSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, auth),
  user: persistReducer(persistConfig, user),
});

// const persistedReducer = persistReducer(persistConfig, user);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
