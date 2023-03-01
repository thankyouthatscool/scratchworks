import { DrawerScreenProps } from "@react-navigation/drawer";

export type RootDrawerNavigatorProps = {
  Home: undefined;
  Recipe: undefined;
  Settings: undefined;
};

export type HomeScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "Home"
>;

export type RecipeScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "Recipe"
>;

export type TempUnits = "celsius" | "fahrenheit" | "kelvin";

export type AppSettings = {
  tempUnit: TempUnits;
};

export type AppState = {
  appSettings: Partial<AppSettings>;
};

export type Recipe = {
  id: string;
  name: string;
  tags: string[];
  description?: string;
};
