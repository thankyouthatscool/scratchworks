import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { FC, useRef, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";

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

const { width } = Dimensions.get("screen");

export const RecipeListComponent: FC<RecipeListComponentProps> = ({ nav }) => {
  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <RootWrapper>
      <View
        style={{
          marginRight: 4,
          width: width / 2 - 8 - 2,
          flex: 1,
        }}
      >
        {recipes
          .filter((recipe) =>
            selectedTags.every((tag) => recipe.tags.includes(tag))
          )
          .filter((_, idx) => !(idx % 2))
          .map((recipe, idx) => (
            <RecipeCardComponent
              index={idx}
              key={recipe.id}
              nav={nav}
              recipe={recipe}
            />
          ))}
      </View>
      <View
        style={{
          width: width / 2 - 8 - 2,
          flex: 1,
        }}
      >
        {recipes
          .filter((recipe) =>
            selectedTags.every((tag) => recipe.tags.includes(tag))
          )
          .filter((_, idx) => !!(idx % 2))
          .map((recipe, idx) => (
            <RecipeCardComponent
              index={idx}
              key={recipe.id}
              nav={nav}
              recipe={recipe}
            />
          ))}
      </View>
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
          <Text style={{ fontWeight: "500" }}>{recipe.name}</Text>
          <RecipeTagsComponentWrapper>
            {recipe.tags.map((tag) => (
              <TagWrapper isSelected={selectedTags.includes(tag)} key={tag}>
                <TagWrapperText isSelected={selectedTags.includes(tag)}>
                  {tag}
                </TagWrapperText>
              </TagWrapper>
            ))}
          </RecipeTagsComponentWrapper>
          {recipe.description && (
            <Text style={{ color: "grey", fontSize: 8 }}>
              {recipe.description}
            </Text>
          )}
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
                  .reduce(
                    (acc, { duration }) => acc + (!!duration ? duration : 0),
                    0
                  )}{" "}
                mins prep time
              </Text>
            )}
            {!!recipe.steps.filter((step) => step.type === "cook").length && (
              <Text style={{ color: "grey", fontSize: 10 }}>
                {recipe.steps
                  .filter((step) => step.type === "cook")
                  .reduce(
                    (acc, { duration }) => acc + (!!duration ? duration : 0),
                    0
                  )}{" "}
                mins cook time
              </Text>
            )}
          </View>
          {!!recipe.reactions.length && (
            <Text>{recipe.reactions.join("")}</Text>
          )}
        </View>
      </RecipeCardComponentWrapper>
    </Pressable>
  );
};
