import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  isInitializationComplete: boolean;
  searchTerm: string;
};

const initialState: AppState = {
  isInitializationComplete: false,
  searchTerm: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitializationState: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitializationComplete = payload;
    },
    setSearchTerm: (state, { payload }: PayloadAction<string>) => {
      state.searchTerm = payload;
    },
  },
});

export const { setInitializationState, setSearchTerm } = appSlice.actions;
