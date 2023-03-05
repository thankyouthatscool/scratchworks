import MDIcon from "@expo/vector-icons/MaterialIcons";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  ToastAndroid,
  View,
} from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { updateRecipe } from "@store";
import {
  BigTagWrapper,
  HeaderWrapper,
  MainCardWrapper,
  RootWrapper,
  StyledTextInput,
} from "./Styled";
import { Recipe, RecipeScreenNavigationProps } from "@types";
import { updateLocalStorageRecipe } from "@utils";
import { ScrollView } from "react-native-gesture-handler";

// TODO: Long press on step to start from that step, or just press start to go from the beginning.
// TODO: Eventually an ingredients list.

export const RecipeScreen: FC<RecipeScreenNavigationProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const { recipes, selectedRecipe, selectedTags } = useAppSelector(
    ({ recipes }) => recipes
  );

  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isRecipeInProgress, setIsRecipeInProgress] = useState<boolean>(false);
  const [isStepsOpen, setIsStepsOpen] = useState(false);

  const [recipeDescription, setRecipeDescription] = useState<string>("");
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeStepsText, setRecipeStepsText] = useState<string[]>([]);

  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(false);

  const handleRecipeUpdate = useCallback(async () => {
    dispatch(
      updateRecipe({
        ...targetRecipe!,
        description: recipeDescription,
        name: recipeName,
        steps: targetRecipe?.steps.map((step, idx) => ({
          ...step,
          description: recipeStepsText[idx],
        }))!,
      })
    );

    updateLocalStorageRecipe({
      ...targetRecipe!,
      description: recipeDescription,
      name: recipeName,
      steps: targetRecipe?.steps.map((step, idx) => ({
        ...step,
        description: recipeStepsText[idx],
      }))!,
    });

    setIsUpdateNeeded(() => false);

    Keyboard.dismiss();

    ToastAndroid.show("Recipe updated", ToastAndroid.SHORT);
  }, [recipeDescription, recipeName, recipeStepsText, targetRecipe]);

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
      setRecipeDescription(() => targetRecipe.description || "");
      setRecipeName(() => targetRecipe.name);
      setRecipeStepsText(() =>
        targetRecipe.steps.map((step) => step.description)
      );
    }
  }, [targetRecipe]);

  return (
    <RootWrapper>
      <ScrollView>
        <MainCardWrapper>
          <HeaderWrapper>
            <StyledTextInput
              defaultValue={targetRecipe?.name}
              isHeading
              onChangeText={(newName) => {
                setIsUpdateNeeded(() => true);
                setRecipeName(() => newName);
              }}
            />
            {!!isUpdateNeeded && (
              <Pressable onPress={handleRecipeUpdate}>
                <MDIcon color="orange" name="save" size={24} />
              </Pressable>
            )}
          </HeaderWrapper>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}
          >
            {targetRecipe?.tags.map((tag) => (
              <BigTagWrapper
                isSelectedTag={selectedTags.includes(tag)}
                key={tag}
              >
                <Text style={{ fontSize: 10 }}>{tag}</Text>
              </BigTagWrapper>
            ))}
          </View>
          <StyledTextInput
            defaultValue={recipeDescription}
            multiline
            onChangeText={(newDescription) => {
              setIsUpdateNeeded(() => true);
              setRecipeDescription(() => newDescription);
            }}
            placeholder="Recipe Description"
            textAlignVertical="top"
          />
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Steps</Text>
          {recipeStepsText.map((text, idx) => (
            <View
              key={idx}
              style={{ alignItems: "center", flexDirection: "row" }}
            >
              <Text>🔥</Text>
              <StyledTextInput
                defaultValue={text}
                multiline
                onChangeText={(newText) => {
                  setIsUpdateNeeded(() => true);
                  setRecipeStepsText((data) => [
                    ...data.slice(0, idx),
                    newText,
                    ...data.slice(idx + 1),
                  ]);
                }}
              />
            </View>
          ))}
          <Button
            onPress={() => {
              setRecipeStepsText((steps) => [...steps, ""]);
            }}
            title="Add Step"
          />
          {!!targetRecipe?.steps.length && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginTop: 8,
              }}
            >
              <Button title="Start" />
            </View>
          )}
        </MainCardWrapper>
      </ScrollView>
    </RootWrapper>
  );
};
