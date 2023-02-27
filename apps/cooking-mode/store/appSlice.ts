import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppSettings, AppState } from "@types";

const initialState: AppState = { appSettings: { tempUnit: "celsius" } };

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
  },
});

export const { setAppSettings } = appSlice.actions;
