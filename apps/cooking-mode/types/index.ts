import { DrawerScreenProps } from "@react-navigation/drawer";

export type RootDrawerNavigatorProps = {
  Home: undefined;
  Settings: undefined;
};

export type HomeScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "Home"
>;

export type TempUnits = "celsius" | "fahrenheit" | "kelvin";

export type AppSettings = {
  tempUnit: TempUnits;
};

export type AppState = {
  appSettings: Partial<AppSettings>;
};
