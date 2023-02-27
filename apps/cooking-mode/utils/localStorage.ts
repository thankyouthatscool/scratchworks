import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppSettings } from "@types";

export const getLocalStorageSettings = async () => {
  const resString = await AsyncStorage.getItem("appSettings");

  if (!!resString) {
    const appSettings = JSON.parse(resString) as Partial<AppSettings>;

    return appSettings;
  }

  return null;
};

export const setLocalStorageSettings = async (
  appSettings: Partial<AppSettings>
) => {
  try {
    const currentAppSettings = await getLocalStorageSettings();

    if (!!currentAppSettings) {
      await AsyncStorage.setItem(
        "appSettings",
        JSON.stringify({ ...currentAppSettings, ...appSettings })
      );
    } else {
      await AsyncStorage.setItem("appSettings", JSON.stringify(appSettings));
    }

    return true;
  } catch {
    return false;
  }
};
