import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Torrent } from "@scratchworks/scratchworks-services";

type AppState = {
  fetchInterval: number;
  footerHeight: number;
  headerHeight: number;
  isAutoPauseEnabled: boolean;
  isBottomSheetOpen: boolean;
  isInitializationComplete: boolean;
  torrents: Torrent[];
};

const initialState: AppState = {
  fetchInterval: 3,
  footerHeight: 35,
  headerHeight: 49,
  isAutoPauseEnabled: false,
  isBottomSheetOpen: false,
  isInitializationComplete: false,
  torrents: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAutoPause: (state, { payload }: PayloadAction<boolean>) => {
      state.isAutoPauseEnabled = payload;
    },
    setBottomSheetState: (state, { payload }: PayloadAction<boolean>) => {
      state.isBottomSheetOpen = payload;
    },
    setFetchInterval: (state, { payload }) => {
      state.fetchInterval = payload;
    },
    setInitializationState: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitializationComplete = payload;
    },
    setTorrents: (state, { payload }: PayloadAction<Torrent[]>) => {
      state.torrents = payload;
    },
  },
});

export const {
  setAutoPause,
  setBottomSheetState,
  setFetchInterval,
  setInitializationState,
  setTorrents,
} = appSlice.actions;
