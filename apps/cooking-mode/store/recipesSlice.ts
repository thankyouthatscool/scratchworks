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
  recipes: [
    {
      id: "6fdba64c-8281-4433-85a1-d27e22bf2cc3",
      name: "Test Recipe 1",
      steps: [
        {
          description: "Prep step",
          duration: 2,
          id: "528a7875-ecbe-4f88-8481-d56a6cd1b3e0",
          type: "prep",
        },
        {
          description: "This is a test step",
          duration: 10,
          id: "528a7875-ecbe-4f88-8481-d56a6c11b3e0",
          type: "cook",
        },
      ],
      tags: ["air fryer", "vegetables"],
    },
    {
      id: "5ab6c8d7-f3a5-4700-a2d8-4624129dc5a0",
      name: "Test Recipe 2",
      steps: [],
      tags: ["air fryer", "meats"],
    },
    {
      id: "13c7aa34-b306-4c50-a4d6-2eacf40e356d",
      name: "Test Recipe 3",
      steps: [],
      tags: ["meats", "big health"],
    },
    {
      id: "03b8d523-72f1-4595-aec1-76f7c0e01db6",
      name: "Test Recipe 4",
      steps: [],
      tags: ["vegetables", "big health", "baked"],
    },
    {
      id: "47641fda-0b8a-4beb-be54-0aa71498b47b",
      name: "Test Recipe 5",
      steps: [],
      tags: ["vegetables", "narsty", "baked", "test 1", "test 2", "test 3"],
    },
    {
      id: "0d427b8a-eaa2-4135-bdc8-3e620ebc6838",
      name: "Test Recipe 6",
      steps: [],
      tags: ["baked", "indulge"],
    },
    {
      id: "0d427b8a-eaa2-4135-bdc8-3e620ebc6839",
      name: "Test Recipe 7",
      steps: [],
      tags: ["baked", "indulge"],
    },
    {
      id: "0d427b8a-eaa2-4135-bdc8-3e620ebc6840",
      name: "Test Recipe 8",
      steps: [],
      tags: ["baked", "indulge", "go fuck yourself in the ass"],
    },
  ],
  selectedRecipe: null,
  selectedTags: [],
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSelectedRecipe: (state, { payload }: PayloadAction<string | null>) => {
      state.selectedRecipe = payload;
    },
    setSelectedTags: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedTags = payload;
    },
  },
});

export const { setSelectedRecipe, setSelectedTags } = recipesSlice.actions;
