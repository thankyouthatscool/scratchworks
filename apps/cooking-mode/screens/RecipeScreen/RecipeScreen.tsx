import { FC, useCallback, useEffect, useState } from "react";
import { Button, Text, ToastAndroid, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { updateRecipe } from "@store";
import {
  HeaderWrapper,
  MainCardWrapper,
  RootWrapper,
  StyledTextInput,
} from "./Styled";
import { Recipe, RecipeScreenNavigationProps } from "@types";
import { updateLocalStorageRecipe } from "@utils";

export const RecipeScreen: FC<RecipeScreenNavigationProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const { recipes, selectedRecipe } = useAppSelector(({ recipes }) => recipes);

  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isRecipeInProgress, setIsRecipeInProgress] = useState<boolean>(false);
  const [isStepsOpen, setIsStepsOpen] = useState(false);

  const [recipeStepsText, setRecipeStepsText] = useState<string[]>([]);
  const [recipeDescription, setRecipeDescription] = useState<string>("");

  const handleRecipeUpdate = useCallback(async () => {
    setIsEditMode(() => false);

    dispatch(
      updateRecipe({
        ...targetRecipe!,
        steps: targetRecipe?.steps.map((step, idx) => ({
          ...step,
          description: recipeStepsText[idx],
        }))!,
        description: recipeDescription,
      })
    );

    updateLocalStorageRecipe({
      ...targetRecipe!,
      description: recipeDescription,
      steps: targetRecipe?.steps.map((step, idx) => ({
        ...step,
        description: recipeStepsText[idx],
      }))!,
    });

    ToastAndroid.show("Recipe updated", ToastAndroid.SHORT);
  }, [recipeDescription, recipeStepsText, targetRecipe]);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    } else {
      navigation.navigate("Home");
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (!!targetRecipe) {
      setRecipeStepsText(() =>
        targetRecipe.steps.map((step) => step.description)
      );

      setRecipeDescription(() => targetRecipe.description || "");
    }
  }, [targetRecipe]);

  return (
    <RootWrapper>
      <MainCardWrapper>
        <HeaderWrapper>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>
            {targetRecipe?.name}
          </Text>
          <Button
            onPress={() => {
              if (!!isEditMode) {
                handleRecipeUpdate();
              } else {
                setIsEditMode(() => true);
              }
            }}
            title={!!isEditMode ? "Save" : "Edit"}
          />
        </HeaderWrapper>
        <Text>Ingredients - Basic </Text>
        <StyledTextInput
          defaultValue={recipeDescription}
          editable={isEditMode}
          multiline
          numberOfLines={4}
          onChangeText={(newDescription) =>
            setRecipeDescription(() => newDescription)
          }
          placeholder="Recipe Description"
          textAlignVertical="top"
        />
        <Text>Steps - {targetRecipe?.steps.length}</Text>
        {recipeStepsText.map((text, idx) => (
          <View
            key={idx}
            style={{ alignItems: "center", flexDirection: "row" }}
          >
            <Text>{idx + 1}: </Text>
            <StyledTextInput
              defaultValue={text}
              editable={isEditMode}
              onChangeText={(newText) => {
                setRecipeStepsText((data) => [
                  ...data.slice(0, idx),
                  newText,
                  ...data.slice(idx + 1),
                ]);
              }}
            />
          </View>
        ))}
        {!!targetRecipe?.steps.length && (
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Button title="Start" />
          </View>
        )}
      </MainCardWrapper>
    </RootWrapper>
  );
};
