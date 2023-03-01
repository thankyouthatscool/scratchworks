import { FC } from "react";
import { Button, Text, View } from "react-native";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { useAppSelector } from "@hooks";
import { HomeScreenNavigationProps } from "@types";

import { TagSelectorComponent } from "@components/TagSelectorComponent";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <RecipeListComponent />
    </ScreenWrapper>
  );
};

export const RecipeListComponent = () => {
  const { recipes, selectedTags } = useAppSelector(({ recipes }) => recipes);

  return (
    <View>
      {recipes
        .filter((recipe) =>
          selectedTags.every((tag) => recipe.tags.includes(tag))
        )
        .map((recipe) => (
          <View key={recipe.name}>
            <Text>{recipe.name}</Text>
            {recipe.tags.map((tag, idx) => (
              <Text key={idx} style={{ color: "gray", fontSize: 10 }}>
                {tag}
              </Text>
            ))}
          </View>
        ))}
    </View>
  );
};
