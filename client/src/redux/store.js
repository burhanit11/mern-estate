// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./user/userSlice";

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userReducer from "./user/userSlice";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const rootReducer = combineReducers({ user: userReducer });

// const persistConfig = {
//   key: "root",
//   storage,
//   version: 1,
// };

// const persistedUserReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedUserReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// Persist only currentUser
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"], // ✅ only persist currentUser
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
