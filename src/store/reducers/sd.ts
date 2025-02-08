import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../initialState";

const storeSlice = createSlice({
  name: "storeData",
  initialState,

  reducers: {
    storeUserData(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },

  extraReducers: () => {},
});

export const { storeUserData } = storeSlice.actions;

export const storeData = storeSlice.reducer;
