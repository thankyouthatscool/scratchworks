import MDIcon from "@expo/vector-icons/MaterialIcons";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import uuid from "react-native-uuid";

import { useAppDispatch, useAppSelector } from "@hooks";
import { updateRecipe } from "@store";
import {
  BigTagWrapper,
  HeaderWrapper,
  InnerModalContainerWrapper,
  MainCardWrapper,
  OuterModalContainerWrapper,
  RootWrapper,
  StyledTextInput,
} from "./Styled";
import { Recipe, RecipeStep, RecipeScreenNavigationProps } from "@types";
import { updateLocalStorageRecipe } from "@utils";

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
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([]);

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedRecipeStep, setSelectedRecipeStep] =
    useState<RecipeStep | null>(null);

  const [isStepEditModalOpen, setIsStepEditModalOpen] =
    useState<boolean>(false);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(false);

  const handleRecipeStepUpdate = useCallback(async () => {
    const targetRecipeStep = recipeSteps.find(
      (recipe) => recipe.id === selectedStepId
    );

    const targetRecipeStepIndex = recipeSteps.indexOf(targetRecipeStep!);

    setRecipeSteps((recipeSteps) => [
      ...recipeSteps.slice(0, targetRecipeStepIndex),
      {
        ...recipeSteps[targetRecipeStepIndex],
        duration: selectedRecipeStep?.duration,
        type: selectedRecipeStep?.type,
      },
      ...recipeSteps.slice(targetRecipeStepIndex + 1),
    ]);

    setIsUpdateNeeded(() => true);
  }, [recipeSteps, selectedRecipeStep, selectedStepId]);

  const handleRecipeUpdate = useCallback(async () => {
    dispatch(
      updateRecipe({
        ...targetRecipe!,
        description: recipeDescription,
        name: recipeName,
        steps: recipeSteps,
      })
    );

    updateLocalStorageRecipe({
      ...targetRecipe!,
      description: recipeDescription,
      name: recipeName,
      steps: recipeSteps,
    });

    setIsUpdateNeeded(() => false);

    Keyboard.dismiss();

    ToastAndroid.show("Recipe updated", ToastAndroid.SHORT);
  }, [recipeDescription, recipeName, recipeSteps, targetRecipe]);

  const handleUpdateStepDescriptionText = (newText: string, idx: number) => {
    setIsUpdateNeeded(() => true);
    setRecipeSteps((data) => [
      ...data.slice(0, idx),
      { ...data[idx], description: newText },
      ...data.slice(idx + 1),
    ]);
  };

  const handleUpdateStepDetails = ({
    duration,
    idx,
    type,
  }: {
    duration?: number;
    idx: number;
    type?: "cook" | "prep";
  }) => {
    setIsUpdateNeeded(() => true);
    setRecipeSteps((data) => [
      ...data.slice(0, idx),
      {
        ...data[idx],
        duration:
          duration === 0 ? 0 : !!duration ? duration : data[idx].duration,
        type: !!type ? type : data[idx].type,
      },
      ...data.slice(idx + 1),
    ]);
  };

  // Effects
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
      setRecipeSteps(() => targetRecipe.steps.map((step) => step));
    }
  }, [targetRecipe]);

  useEffect(() => {
    if (!!selectedStepId && !!targetRecipe) {
      setSelectedRecipeStep(
        () => targetRecipe.steps.find((step) => step.id === selectedStepId)!
      );
    }
  }, [selectedStepId, targetRecipe]);

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
            style={{
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            {targetRecipe?.tags.map((tag) => (
              <BigTagWrapper
                isSelectedTag={selectedTags.includes(tag)}
                key={tag}
              >
                <Text style={{ fontSize: 10 }}>{tag}</Text>
              </BigTagWrapper>
            ))}
            <View>
              <Text style={{ fontSize: 7.5 }}>
                {recipeSteps.reduce((acc, val) => {
                  if (val.type === "prep" && !!val.duration) {
                    return acc + val.duration;
                  }

                  return acc;
                }, 0)}{" "}
                min prep time
              </Text>
              <Text style={{ fontSize: 7.5 }}>
                {recipeSteps.reduce((acc, val) => {
                  if (val.type === "cook" && !!val.duration) {
                    return acc + val.duration;
                  }

                  return acc;
                }, 0)}{" "}
                min cook time
              </Text>
            </View>
          </View>
          <StyledTextInput
            defaultValue={recipeDescription}
            isMargin
            multiline
            onChangeText={(newDescription) => {
              setIsUpdateNeeded(() => true);
              setRecipeDescription(() => newDescription);
            }}
            placeholder="Recipe Description"
            textAlignVertical="center"
          />
          {recipeSteps.map((recipeStep, idx) => (
            <RecipeStepCard
              handleUpdateStepText={handleUpdateStepDescriptionText}
              handleUpdateStepDetails={handleUpdateStepDetails}
              idx={idx}
              isFirst={idx === 0}
              isLast={idx === recipeSteps.length - 1}
              key={recipeStep.id}
              onRecipeStepUpdate={setSelectedRecipeStep}
              recipeStep={recipeStep}
            />
          ))}
          <Button
            disabled={
              !!recipeSteps.length &&
              !recipeSteps[recipeSteps.length - 1]?.description
            }
            onPress={() => {
              setRecipeSteps((steps) => [
                ...steps,
                { description: "", id: uuid.v4() as string },
              ]);
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

interface RecipeCardProps {
  handleUpdateStepText: (newText: string, idx: number) => void;
  handleUpdateStepDetails: ({
    duration,
  }: {
    duration?: number;
    idx: number;
    type?: "cook" | "prep";
  }) => void;
  idx: number;
  isFirst: boolean;
  isLast: boolean;
  recipeStep: RecipeStep;
  onRecipeStepUpdate: React.Dispatch<React.SetStateAction<RecipeStep | null>>;
}

const RecipeStepCard: FC<RecipeCardProps> = ({
  handleUpdateStepText,
  handleUpdateStepDetails,
  idx,
  isFirst,
  isLast,
  recipeStep,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Pressable
      onLongPress={() =>
        isExpanded ? () => {} : setIsExpanded((isExpanded) => !isExpanded)
      }
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          elevation: 2,
          marginVertical: 4,
          marginTop: isFirst ? 0 : 4,
          marginBottom: isLast ? 8 : 4,
          padding: 8,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <StyledTextInput
            defaultValue={recipeStep.description}
            editable={isExpanded}
            isMargin
            multiline
            onChangeText={(newText) => handleUpdateStepText(newText, idx)}
          />
        </View>
        {!!isExpanded && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <StyledTextInput
                defaultValue={recipeStep.duration?.toString() || ""}
                editable={false}
                isFlex
                placeholder="Step Duration"
              />
              <Button
                disabled={!recipeStep.duration}
                color="red"
                onPress={() => {
                  if (!!recipeStep.duration) {
                    handleUpdateStepDetails({
                      duration: recipeStep.duration - 1,
                      idx,
                    });
                  }
                }}
                title="Downies"
              />
              <View style={{ marginLeft: 4 }}>
                <Button
                  color="green"
                  onPress={() => {
                    if (!recipeStep.duration) {
                      return handleUpdateStepDetails({ duration: 1, idx });
                    }

                    return handleUpdateStepDetails({
                      duration: recipeStep.duration + 1,
                      idx,
                    });
                  }}
                  title="Uppies"
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  handleUpdateStepDetails({ idx, type: "prep" });
                }}
                style={{ flex: 1, marginRight: 4 }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderColor: recipeStep.type === "prep" ? "green" : "white",
                    borderRadius: 5,
                    borderWidth: 2,
                    elevation: 2,
                    padding: 4,
                  }}
                >
                  <Text>Prep</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleUpdateStepDetails({ idx, type: "cook" });
                }}
                style={{ flex: 1, marginLeft: 4 }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderColor: recipeStep.type === "cook" ? "green" : "white",
                    borderRadius: 5,
                    borderWidth: 2,
                    elevation: 2,
                    padding: 4,
                  }}
                >
                  <Text>Cook</Text>
                </View>
              </Pressable>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Pressable
                onPress={() => {
                  setIsExpanded(() => false);
                }}
              >
                <MDIcon name="expand-less" size={32} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};
