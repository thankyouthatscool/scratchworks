import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Event, Location } from "@scratchworks/inertiion-services";

type WarehouseLocations = Location & { events: Event[] };

export const setLSWarehouseStorageLocations = async (
  locationsData: WarehouseLocations[]
) => {
  await AsyncStorage.setItem(
    "warehouseLocations",
    JSON.stringify(locationsData)
  );
};

export const setLSUniqueWarehouseLocations = async (
  uniqueLocations: string[]
) => {
  await AsyncStorage.setItem(
    "uniqueWarehouseLocations",
    JSON.stringify(uniqueLocations)
  );
};

export const getLSUniqueWarehouseStorageLocations = async () => {
  const resString = await AsyncStorage.getItem("uniqueWarehouseLocations");

  if (!resString) return null;

  if (!JSON.parse(resString).length) return null;

  return JSON.parse(resString) as string[];
};

export const getLSWarehouseStorageLocations = async () => {
  const resString = await AsyncStorage.getItem("warehouseLocations");

  if (!resString) return null;

  if (!JSON.parse(resString).length) return null;

  return JSON.parse(resString) as WarehouseLocations[];
};

export const clearLSWarehouseStorageLocations = async () => {
  await AsyncStorage.removeItem("warehouseLocations");
};
