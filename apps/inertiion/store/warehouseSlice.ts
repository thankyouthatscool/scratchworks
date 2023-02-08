import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Event, Location } from "@scratchworks/inertiion-services";

type AppState = {
  selectedWarehouseStorageLocation: string | null;
  warehouseStorageLocations: (Location & { events: Event[] })[];
};

const initialState: AppState = {
  selectedWarehouseStorageLocation: null,
  warehouseStorageLocations: [],
};

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    addWarehouseStorageItem: (
      state,
      { payload }: PayloadAction<Location & { events: Event[] }>
    ) => {
      console.log(payload);

      state.warehouseStorageLocations = [
        ...state.warehouseStorageLocations,
        payload,
      ];
    },
    editWarehouseStorageItem: (
      state,
      { payload }: PayloadAction<Location & { events: Event[] }>
    ) => {
      const targetItem = state.warehouseStorageLocations.find(
        (loc) => loc.id === payload.id
      );

      const targetItemIndex = state.warehouseStorageLocations.indexOf(
        targetItem!
      );

      state.warehouseStorageLocations = [
        ...state.warehouseStorageLocations.slice(0, targetItemIndex),
        payload,
        ...state.warehouseStorageLocations.slice(targetItemIndex + 1),
      ];
    },
    removeWarehouseStorageItem: (state, { payload }: PayloadAction<string>) => {
      state.warehouseStorageLocations = state.warehouseStorageLocations.filter(
        (item) => item.id !== payload
      );
    },

    //
    setSelectedWarehouseStorageLocation: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
      state.selectedWarehouseStorageLocation = payload;
    },
    setWarehouseStorageLocations: (
      state,
      { payload }: PayloadAction<(Location & { events: Event[] })[]>
    ) => {
      state.warehouseStorageLocations = payload;
    },
  },
});

export const {
  // Items
  addWarehouseStorageItem,
  editWarehouseStorageItem,
  removeWarehouseStorageItem,

  // Locations
  setSelectedWarehouseStorageLocation,
  setWarehouseStorageLocations,
} = warehouseSlice.actions;
