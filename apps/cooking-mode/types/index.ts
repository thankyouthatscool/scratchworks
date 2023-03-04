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

type RecipeStep = {
  description: string;
  duration: number;
  sub?: boolean;
  id: string;
  type: "prep" | "cook";
};

export type Recipe = {
  id: string;
  description?: string;
  name: string;
  steps: RecipeStep[];
  reactions: string[];
  tags: string[];
};
