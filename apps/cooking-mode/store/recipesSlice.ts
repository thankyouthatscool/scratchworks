import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Recipe } from "@types";

type RecipesState = {
  activeStep: string | null;
  recipes: Recipe[];
  selectedRecipe: string | null;
  selectedTags: string[];
};

const initialState: RecipesState = {
  activeStep: null,
  recipes: [],
  selectedRecipe: null,
  selectedTags: [],
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    // Recipes
    addNewRecipe: (state, { payload }: PayloadAction<Recipe>) => {
      state.recipes = [...state.recipes, payload];
    },
    bulkSetRecipes: (state, { payload }: PayloadAction<Recipe[]>) => {
      state.recipes = payload;
    },
    setSelectedRecipe: (state, { payload }: PayloadAction<string | null>) => {
      state.selectedRecipe = payload;
    },
    updateRecipe: (state, { payload }: PayloadAction<Recipe>) => {
      const targetRecipe = state.recipes.find(
        (recipe) => recipe.id === payload.id
      )!;
      const targetRecipeIndex = state.recipes.indexOf(targetRecipe);

      state.recipes = [
        ...state.recipes.slice(0, targetRecipeIndex),
        payload,
        ...state.recipes.slice(targetRecipeIndex + 1),
      ];
    },

    // Tags
    setSelectedTags: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedTags = payload;
    },
  },
});

export const {
  // Data
  // Recipes
  addNewRecipe,
  bulkSetRecipes,
  setSelectedRecipe,
  updateRecipe,

  //Tags
  setSelectedTags,
} = recipesSlice.actions;
