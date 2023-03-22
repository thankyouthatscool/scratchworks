import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppSettings, AppState, Recipe } from "@types";

const initialState: AppState = {
  appSettings: { tempUnit: "celsius" },
  isAddNewRecipeModalOpen: false,
  isAppVisible: true,
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
    setIsAppVisible: (state, { payload }: PayloadAction<boolean>) => {
      state.isAppVisible = payload;
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
  setIsAppVisible,
  setLastReversibleAction,
} = appSlice.actions;
