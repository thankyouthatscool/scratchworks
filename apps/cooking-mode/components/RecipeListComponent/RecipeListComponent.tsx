import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { FC, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

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

  const pressableRef = useRef<View | null>(null);

  return (
    <Pressable
      onPress={() => {
        dispatch(setSelectedRecipe(recipe.id));

        nav.navigate("Recipe");
      }}
      onPressIn={() => setIsPressedIn(() => true)}
      onPressOut={() => setIsPressedIn(() => false)}
      ref={pressableRef}
      key={recipe.id}
    >
      <RecipeCardComponentWrapper index={index} pressedIn={isPressedIn}>
        <View>
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
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View>
            {!!recipe.steps.filter((step) => step.type === "prep").length && (
              <Text style={{ color: "grey", fontSize: 10 }}>
                {recipe.steps
                  .filter((step) => step.type === "prep")
                  .reduce((acc, { duration }) => acc + duration, 0)}{" "}
                mins prep time
              </Text>
            )}
            {!!recipe.steps.filter((step) => step.type === "cook").length && (
              <Text style={{ color: "grey", fontSize: 10 }}>
                {recipe.steps
                  .filter((step) => step.type === "cook")
                  .reduce((acc, { duration }) => acc + duration, 0)}{" "}
                mins cook time
              </Text>
            )}
          </View>
          <Text>😊👌💩</Text>
        </View>
      </RecipeCardComponentWrapper>
    </Pressable>
  );
};
