import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from "@react-navigation/drawer";

export type RootDrawerNavigatorProps = {
  Home: undefined;
  Recipe: undefined;
  RecipePlayer: undefined;
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

export type RecipePlayerScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "RecipePlayer"
>;

export type RecipePlayerScreenNavProps = DrawerNavigationProp<
  RootDrawerNavigatorProps,
  "RecipePlayer"
>;

export type TempUnits = "celsius" | "fahrenheit" | "kelvin";

export type AppSettings = {
  tempUnit: TempUnits;
};

export type AppState = {
  appSettings: Partial<AppSettings>;
  isAddNewRecipeModalOpen: boolean;
  isAppVisible: boolean;
  isRecipeStepsDoneModalOpen: boolean;
  lastReversibleAction: { operation: string; data: Recipe } | null;
};

export type RecipeStep = {
  description: string;
  duration?: number;
  sub?: boolean;
  id: string;
  type?: "prep" | "cook";
};

export type Recipe = {
  id: string;
  description?: string;
  name: string;
  steps: RecipeStep[];
  reactions: string[];
  tags: string[];
};

// Cooking Log
export interface RecipeLog {
  comments: string;
  date: Date;
  pictures: string[];
  rating: number | undefined;
  recipeId: string | undefined;
}

export interface RecipeLogWithId extends RecipeLog {
  id: string;
}
