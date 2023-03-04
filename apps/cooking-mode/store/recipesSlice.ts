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
    bulkSetRecipes: (state, { payload }: PayloadAction<Recipe[]>) => {
      state.recipes = payload;
    },
    setSelectedRecipe: (state, { payload }: PayloadAction<string | null>) => {
      state.selectedRecipe = payload;
    },
    setSelectedTags: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedTags = payload;
    },
  },
});

export const {
  // Data
  // Recipes
  bulkSetRecipes,
  setSelectedRecipe,
  setSelectedTags,
} = recipesSlice.actions;
