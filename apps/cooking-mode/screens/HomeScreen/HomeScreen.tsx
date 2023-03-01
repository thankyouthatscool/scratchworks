import { FC } from "react";
import { Button, Pressable, Text, View } from "react-native";

import type { DrawerNavigationProp } from "@react-navigation/drawer";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setSelectedRecipe } from "@store";
import { HomeScreenNavigationProps, RootDrawerNavigatorProps } from "@types";

import { TagSelectorComponent } from "@components/TagSelectorComponent";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <RecipeListComponent nav={navigation} />
    </ScreenWrapper>
  );
};

interface RecipeListComponentProps {
  nav: DrawerNavigationProp<RootDrawerNavigatorProps, "Home">;
}

export const RecipeListComponent: FC<RecipeListComponentProps> = ({ nav }) => {
  const dispatch = useAppDispatch();

  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <View>
      {recipes
        .filter((recipe) =>
          selectedTags.every((tag) => recipe.tags.includes(tag))
        )
        .map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => {
              dispatch(setSelectedRecipe(recipe.id));

              nav.navigate("Recipe");
            }}
          >
            <View>
              <Text>{recipe.name}</Text>
              {recipe.tags.map((tag, idx) => (
                <Text key={idx} style={{ color: "gray", fontSize: 10 }}>
                  {tag}
                </Text>
              ))}
            </View>
          </Pressable>
        ))}
    </View>
  );
};
