import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import type { AppSettings, Recipe, RecipeLog, RecipeLogWithId } from "@types";

// Settings

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

// Data
// Recipes
export const getAllLocalStorageRecipes = async () => {
  const resString = await AsyncStorage.getItem("recipes");

  if (!!resString) {
    const recipes = JSON.parse(resString) as Recipe[];

    return { recipes, status: true };
  } else {
    return { recipes: [], status: false };
  }
};

export const bulkSetLocalStorageRecipes = async (recipes: Recipe[]) => {
  try {
    await AsyncStorage.setItem("recipes", JSON.stringify(recipes));

    return { status: true };
  } catch {
    return { status: false };
  }
};

export const updateLocalStorageRecipe = async (updatedRecipe: Recipe) => {
  const resString = await AsyncStorage.getItem("recipes");

  const recipes = JSON.parse(resString!) as Recipe[];

  const targetRecipe = recipes.find(
    (recipe) => recipe.id === updatedRecipe.id
  )!;
  const targetRecipeIndex = recipes.indexOf(targetRecipe);

  const updatedRecipes = [
    ...recipes.slice(0, targetRecipeIndex),
    updatedRecipe,
    ...recipes.slice(targetRecipeIndex + 1),
  ];

  await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes));
};

export const addNewLocalStorageRecipe = async (newRecipe: Recipe) => {
  const existingRecipesString = await AsyncStorage.getItem("recipes");

  if (!!existingRecipesString) {
    const existingRecipes: Recipe[] = JSON.parse(existingRecipesString);

    await AsyncStorage.setItem(
      "recipes",
      JSON.stringify([...existingRecipes, newRecipe])
    );
  } else {
    await AsyncStorage.setItem("recipes", JSON.stringify([newRecipe]));
  }
};

export const deleteLocalStorageRecipe = async (recipeId: string) => {
  const existingRecipesString = await AsyncStorage.getItem("recipes");

  const existingRecipes: Recipe[] = JSON.parse(existingRecipesString!);

  const remainingRecipes = existingRecipes.filter(
    (recipe) => recipe.id !== recipeId
  );

  await AsyncStorage.setItem("recipes", JSON.stringify(remainingRecipes));
};

// Logs
export const saveLocalStorageRecipeLog = async (recipeLog: RecipeLog) => {
  const existingRecipeLogsString = await AsyncStorage.getItem("recipeLogs");

  try {
    if (!!existingRecipeLogsString) {
      const existingRecipeLogs = JSON.parse(
        existingRecipeLogsString
      ) as RecipeLogWithId[];

      await AsyncStorage.setItem(
        "recipeLogs",
        JSON.stringify([
          ...existingRecipeLogs,
          { ...recipeLog, id: uuid.v4() as string },
        ])
      );
    } else {
      await AsyncStorage.setItem(
        "recipeLogs",
        JSON.stringify([{ ...recipeLog, id: uuid.v4() as string }])
      );
    }

    return { status: 200 };
  } catch {
    return { status: 500 };
  }
};

export const getLocalStorageRecipeLogs = async (targetRecipeId: string) => {
  const existingRecipeLogsString = await AsyncStorage.getItem("recipeLogs");

  try {
    if (!!existingRecipeLogsString) {
      const existingRecipeLogs = JSON.parse(
        existingRecipeLogsString
      ) as RecipeLogWithId[];

      return {
        status: 200,
        logs: existingRecipeLogs.filter(
          (recipe) => recipe.recipeId === targetRecipeId
        ),
      };
    } else {
      return { status: 200, logs: [] };
    }
  } catch {
    return { status: 500, logs: [] };
  }
};

export const updateLocalStorageRecipeLog = async () => {};

export const deleteLocalStorageRecipeLog = async () => {};
