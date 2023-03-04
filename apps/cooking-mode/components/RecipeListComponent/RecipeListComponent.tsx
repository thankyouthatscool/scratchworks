import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { FC, useState } from "react";
import { Pressable, Text } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setSelectedRecipe } from "@store";
import {
  RecipeTagsComponentWrapper,
  RecipeCardComponentWrapper,
  RootWrapper,
  TagWrapper,
  TagWrapperText,
} from "./Styled";
import { Recipe, RootDrawerNavigatorProps } from "@types";

interface RecipeListComponentProps {
  nav: DrawerNavigationProp<RootDrawerNavigatorProps, "Home">;
}

export const RecipeListComponent: FC<RecipeListComponentProps> = ({ nav }) => {
  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <RootWrapper>
      {recipes
        .filter((recipe) =>
          selectedTags.every((tag) => recipe.tags.includes(tag))
        )
        .map((recipe, index) => (
          <RecipeCardComponent
            index={index}
            key={recipe.id}
            nav={nav}
            recipe={recipe}
          />
        ))}
    </RootWrapper>
  );
};

export const RecipeCardComponent: FC<{
  index: number;
  nav: DrawerNavigationProp<RootDrawerNavigatorProps, "Home">;
  recipe: Recipe;
}> = ({ index, nav, recipe }) => {
  const dispatch = useAppDispatch();

  const { selectedTags } = useAppSelector(({ recipes }) => recipes);

  const [isPressedIn, setIsPressedIn] = useState(false);

  return (
    <Pressable
      onPress={() => {
        dispatch(setSelectedRecipe(recipe.id));

        nav.navigate("Recipe");
      }}
      onPressIn={() => setIsPressedIn(() => true)}
      onPressOut={() => setIsPressedIn(() => false)}
      key={recipe.id}
    >
      <RecipeCardComponentWrapper index={index} pressedIn={isPressedIn}>
        <Text>{recipe.name}</Text>
        <RecipeTagsComponentWrapper>
          {recipe.tags.map((tag) => (
            <TagWrapper isSelected={selectedTags.includes(tag)} key={tag}>
              <TagWrapperText isSelected={selectedTags.includes(tag)}>
                {tag}
              </TagWrapperText>
            </TagWrapper>
          ))}
        </RecipeTagsComponentWrapper>
      </RecipeCardComponentWrapper>
    </Pressable>
  );
};
