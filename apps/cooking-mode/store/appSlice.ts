import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppSettings, AppState } from "@types";

const initialState: AppState = {
  appSettings: { tempUnit: "celsius" },
  isAddNewRecipeModalOpen: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppSettings: (
      state,
      { payload }: PayloadAction<Partial<AppSettings>>
    ) => {
      state.appSettings = { ...state.appSettings, ...payload };
    },
    setIsAddNewRecipeModalOpen: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isAddNewRecipeModalOpen = payload;
    },
  },
});

export const { setAppSettings, setIsAddNewRecipeModalOpen } = appSlice.actions;
