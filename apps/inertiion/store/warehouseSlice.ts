import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WarehouseStorageLocation } from "@scratchworks/inertiion-services";

type AppState = {
  selectedWarehouseStorageLocation: string | null;
  warehouseStorageLocations: {
    [key: string]: WarehouseStorageLocation[];
  };
};

const initialState: AppState = {
  selectedWarehouseStorageLocation: null,
  warehouseStorageLocations: {},
};

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    setSelectedWarehouseStorageLocation: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
      state.selectedWarehouseStorageLocation = payload;
    },
    setWarehouseStorageLocations: (
      state,
      {
        payload,
      }: PayloadAction<{
        [key: string]: WarehouseStorageLocation[];
      }>
    ) => {
      state.warehouseStorageLocations = payload;
    },
  },
});

export const {
  setSelectedWarehouseStorageLocation,
  setWarehouseStorageLocations,
} = warehouseSlice.actions;
