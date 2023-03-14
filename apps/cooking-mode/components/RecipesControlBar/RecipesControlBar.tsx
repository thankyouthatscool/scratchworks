import { Button, Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setIsAddNewRecipeModalOpen } from "@store";

import {
  RecipeControlBarRootWrapper,
  RecipeControlBarText,
  RecipeControlBarTextWrapper,
} from "./Styled";

export const RecipesControlBar = () => {
  const dispatch = useAppDispatch();

  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <RecipeControlBarRootWrapper>
      <RecipeControlBarTextWrapper>
        <RecipeControlBarText>
          {
            recipes.filter((recipe) =>
              selectedTags.every((tag) => recipe.tags.includes(tag))
            ).length
          }{" "}
          recipes available
        </RecipeControlBarText>
      </RecipeControlBarTextWrapper>
      <Pressable>
        <View>
          <Button
            color="green"
            onPress={() => {
              dispatch(setIsAddNewRecipeModalOpen(true));
            }}
            title="+ Add Recipe"
          />
        </View>
      </Pressable>
    </RecipeControlBarRootWrapper>
  );
};
