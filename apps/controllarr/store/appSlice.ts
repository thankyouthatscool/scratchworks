import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Torrent } from "@scratchworks/scratchworks-services";

type AppState = { isInitializationComplete: boolean; torrents: Torrent[] };

const initialState: AppState = {
  isInitializationComplete: false,
  torrents: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitializationState: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitializationComplete = payload;
    },
    setTorrents: (state, { payload }: PayloadAction<Torrent[]>) => {
      state.torrents = payload;
    },
  },
});

export const { setInitializationState, setTorrents } = appSlice.actions;
