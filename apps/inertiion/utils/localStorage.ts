import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WarehouseStorageLocation } from "@scratchworks/inertiion-services";

export const getLSWarehouseStorageLocations = async () => {
  // await AsyncStorage.removeItem("warehouseStorageLocations");

  const resString = await AsyncStorage.getItem("warehouseStorageLocations");

  if (!resString) {
    return null;
  }

  const warehouseStorageLocations: {
    [key: string]: WarehouseStorageLocation[];
  } = JSON.parse(resString);

  return warehouseStorageLocations;
};

export const setLSWarehouseStorageLocations =
  async (warehouseStorageLocations: {
    [key: string]: WarehouseStorageLocation[];
  }) => {
    await AsyncStorage.setItem(
      "warehouseStorageLocations",
      JSON.stringify(warehouseStorageLocations)
    );
  };

export const removePallet = async (palletLocation: string) => {
  const resString = await AsyncStorage.getItem("warehouseStorageLocations");

  const warehouseStorageLocations: {
    [key: string]: WarehouseStorageLocation[];
  } = JSON.parse(resString!);

  const { [palletLocation]: targetLocation, ...rest } =
    warehouseStorageLocations;

  const s = { ...rest, [palletLocation]: [{ Location: palletLocation }] };

  await setLSWarehouseStorageLocations(s);

  return s;
};

type PalletData = {
  Date?: string;
  Description?: string;
  Cartons?: number;
  Pieces?: number;
  Initials?: string;
};

export const savePallet = async (
  palletLocation: string,
  data: PalletData[]
) => {
  const resString = await AsyncStorage.getItem("warehouseStorageLocations");

  const warehouseStorageLocations: {
    [key: string]: WarehouseStorageLocation[];
  } = JSON.parse(resString!);

  const { [palletLocation]: targetLocation, ...rest } =
    warehouseStorageLocations;

  const s = {
    ...rest,
    [palletLocation]: data.map((item) => ({
      ...item,
      Location: palletLocation,
    })),
  };

  await setLSWarehouseStorageLocations(s);

  return s;
};
