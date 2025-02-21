import logger from "redux-logger";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook } from "react-redux";
import { storeData } from "./reducers/sd";
import { env } from "src/lib/env";
import { persistReducer, persistStore } from "redux-persist";

import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["storeData"],
};

const reducer = combineReducers({
  storeData,
});

const serialize = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    env.NODE_ENV === "development"
      ? getDefaultMiddleware(serialize).concat(logger)
      : getDefaultMiddleware(serialize),
});

export const persistor = persistStore(store);

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
