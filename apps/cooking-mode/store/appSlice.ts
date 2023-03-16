import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppSettings, AppState, Recipe } from "@types";

const initialState: AppState = {
  appSettings: { tempUnit: "celsius" },
  isAddNewRecipeModalOpen: false,
  lastReversibleAction: null,
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
    setLastReversibleAction: (
      state,
      { payload }: PayloadAction<{ operation: string; data: Recipe }>
    ) => {
      state.lastReversibleAction = payload;
    },
  },
});

export const {
  setAppSettings,
  setIsAddNewRecipeModalOpen,
  setLastReversibleAction,
} = appSlice.actions;
