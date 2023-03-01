import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Recipe = {
  name: string;
  tags: string[];
};

type RecipesState = {
  recipes: Recipe[];
  selectedTags: string[];
};

const initialState: RecipesState = {
  recipes: [
    { name: "Test Recipe 1", tags: ["air fryer", "vegetables"] },
    { name: "Test Recipe 2", tags: ["air fryer", "meats"] },
    { name: "Test Recipe 3", tags: ["meats", "big health"] },
    { name: "Test Recipe 4", tags: ["vegetables", "big health", "baked"] },
    { name: "Test Recipe 5", tags: ["vegetables", "narsty", "baked"] },
    { name: "Test Recipe 6", tags: ["baked", "indulge"] },
  ],
  selectedTags: [],
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSelectedTags: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedTags = payload;
    },
  },
});

export const { setSelectedTags } = recipesSlice.actions;
