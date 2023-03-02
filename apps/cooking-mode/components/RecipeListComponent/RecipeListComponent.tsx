import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { FC } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setSelectedRecipe } from "@store";
import { RecipeTagsComponentWrapper } from "./Styled";
import { RootDrawerNavigatorProps } from "@types";

const { width } = Dimensions.get("screen");

interface RecipeListComponentProps {
  nav: DrawerNavigationProp<RootDrawerNavigatorProps, "Home">;
}

export const RecipeListComponent: FC<RecipeListComponentProps> = ({ nav }) => {
  const dispatch = useAppDispatch();

  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 8,
        paddingTop: 2,
      }}
    >
      {recipes
        .filter((recipe) =>
          selectedTags.every((tag) => recipe.tags.includes(tag))
        )
        .map((recipe, index) => (
          <Pressable
            onPress={() => {
              dispatch(setSelectedRecipe(recipe.id));

              nav.navigate("Recipe");
            }}
            key={recipe.id}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 5,
                elevation: 2,
                marginBottom: 4,
                marginRight: !(index % 2) ? 4 : 0,
                padding: 4,
                width: width / 2 - 8 - 2,
                alignItems: "center",
              }}
            >
              <Text>{recipe.name}</Text>
              <RecipeTagsComponentWrapper>
                {recipe.tags.map((tag, index) => (
                  <Text
                    key={tag}
                    style={{
                      color: selectedTags.includes(tag) ? "green" : "grey",
                      fontSize: 10,
                    }}
                  >
                    {tag}{" "}
                  </Text>
                ))}
              </RecipeTagsComponentWrapper>
            </View>
          </Pressable>
        ))}
    </ScrollView>
  );
};
