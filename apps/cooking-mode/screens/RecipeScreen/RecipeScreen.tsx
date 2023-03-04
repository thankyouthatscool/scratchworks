import { FC, useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

import { useAppSelector } from "@hooks";
import { RootWrapper } from "./Styled";
import { Recipe, RecipeScreenNavigationProps } from "@types";

export const RecipeScreen: FC<RecipeScreenNavigationProps> = ({
  navigation,
}) => {
  const { recipes, selectedRecipe } = useAppSelector(({ recipes }) => recipes);

  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isStepsOpen, setIsStepsOpen] = useState(false);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    } else {
      navigation.navigate("Home");
    }
  }, [selectedRecipe]);

  return (
    <RootWrapper>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          elevation: 2,
          margin: 8,
          padding: 8,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 16 }}>
            {targetRecipe?.name}
          </Text>
          <Button title="Edit" />
        </View>
        <Text>Ingredients - Basic </Text>
        <Text>Steps - {targetRecipe?.steps.length}</Text>
        {targetRecipe?.steps.map(({ description, id }, idx) => (
          <Text>
            {idx + 1}: {description}
          </Text>
        ))}
        {!!targetRecipe?.steps.length && (
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Button title="Start" />
          </View>
        )}
      </View>
    </RootWrapper>
  );
};
