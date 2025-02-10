import logger from "redux-logger";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook } from "react-redux";
import { storeData } from "./reducers/sd";
import { env } from "src/lib/env";

const reducer = {
  storeData,
};

export const store = configureStore({
  reducer,

  middleware: (getDefaultMiddleware) =>
    env.NODE_ENV === "development"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware().concat(),
});

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
