import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { appSlice } from "./appSlice";
import { warehouseSlice } from "./warehouseSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: { app: appSlice.reducer, warehouse: warehouseSlice.reducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
