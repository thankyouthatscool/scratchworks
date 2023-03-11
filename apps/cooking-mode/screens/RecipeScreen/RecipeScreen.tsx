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
      <Modal
        animationType="slide"
        hardwareAccelerated
        onRequestClose={() => {
          setSelectedStepId(() => null);
          setIsStepEditModalOpen(() => false);
        }}
        transparent
        visible={isStepEditModalOpen}
      >
        <OuterModalContainerWrapper>
          <InnerModalContainerWrapper>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              {targetRecipe?.name}
            </Text>
            <Text>{selectedRecipeStep?.description}</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                defaultValue={selectedRecipeStep?.duration?.toString() || "0"}
                editable={false}
                placeholder="Step Duration"
                style={{ borderWidth: 2, color: "black", flex: 1, padding: 4 }}
              />
              <Button
                // FIX: Right now one minute is the smallest step. Will need to have seconds and all that.
                onPress={() => {
                  if (selectedRecipeStep?.duration! > 1) {
                    setSelectedRecipeStep((step) => ({
                      ...step!,
                      duration: !!step?.duration ? step?.duration! - 1 : 0,
                    }));
                  }
                }}
                title="Downies"
              />
              <Button
                onPress={() => {
                  setSelectedRecipeStep((step) => ({
                    ...step!,
                    duration: !!step?.duration ? step?.duration! + 1 : 1,
                  }));
                }}
                title="Uppies"
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                onPress={() => {
                  setSelectedRecipeStep((step) => ({ ...step!, type: "prep" }));
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      selectedRecipeStep?.type === "prep" ? "green" : "white",
                    borderRadius: 5,
                    borderWidth: 2,
                    elevation: selectedRecipeStep?.type === "prep" ? 0 : 2,
                    marginVertical: 4,
                    marginRight: 4,
                    padding: 4,
                  }}
                >
                  <Text>Prep</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedRecipeStep((step) => ({ ...step!, type: "cook" }));
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      selectedRecipeStep?.type === "cook" ? "green" : "white",
                    borderRadius: 5,
                    borderWidth: 2,
                    elevation: selectedRecipeStep?.type === "cook" ? 0 : 2,
                    marginVertical: 4,
                    marginRight: 4,
                    padding: 4,
                  }}
                >
                  <Text>Cook</Text>
                </View>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Button
                onPress={() => {
                  setSelectedStepId(() => null);
                  setIsStepEditModalOpen(() => false);
                }}
                title="Close"
              />
              <View style={{ flex: 1, marginLeft: 4 }}>
                <Button
                  color="green"
                  onPress={async () => {
                    await handleRecipeStepUpdate();

                    setSelectedStepId(() => null);
                    setIsStepEditModalOpen(() => false);
                  }}
                  title="Update"
                />
              </View>
            </View>
          </InnerModalContainerWrapper>
        </OuterModalContainerWrapper>
      </Modal>
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
            isMargin
            multiline
            onChangeText={(newDescription) => {
              setIsUpdateNeeded(() => true);
              setRecipeDescription(() => newDescription);
            }}
            placeholder="Recipe Description"
            textAlignVertical="center"
          />
          {/* {recipeSteps.map((step, idx) => (
            <Pressable
              key={step.id}
              onLongPress={() => {
                console.log("long press is a go");
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  elevation: 2,
                  marginVertical: 4,
                  padding: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Step {idx + 1}
                  {!!step.duration && ` - ${step.duration} mins`}
                </Text>
                <StyledTextInput
                  defaultValue={step.description}
                  isMargin
                  multiline
                  onChangeText={(newText) => {
                    setIsUpdateNeeded(() => true);
                    setRecipeSteps((data) => [
                      ...data.slice(0, idx),
                      { ...data[idx], description: newText },
                      ...data.slice(idx + 1),
                    ]);
                  }}
                />
              </View>
            </Pressable>
          ))}
          {recipeSteps.map(({ description, id }, idx) => (
            <View
              key={idx}
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Pressable
                onPress={() => {
                  console.log("Starting from this step", id);
                }}
                onLongPress={() => {
                  console.log(id);

                  setSelectedStepId(() => id);

                  setIsStepEditModalOpen(() => true);
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginRight: 8 }}
                >
                  {idx + 1}
                </Text>
              </Pressable>
              <StyledTextInput
                defaultValue={description}
                multiline
                onChangeText={(newText) => {
                  setIsUpdateNeeded(() => true);
                  setRecipeSteps((data) => [
                    ...data.slice(0, idx),
                    { ...data[idx], description: newText },
                    ...data.slice(idx + 1),
                  ]);
                }}
              />
            </View>
          ))} */}
          {recipeSteps.map((recipeStep, idx) => (
            <RecipeStepCard
              handleUpdateStepText={handleUpdateStepDescriptionText}
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
  idx: number;
  isFirst: boolean;
  isLast: boolean;
  recipeStep: RecipeStep;
  onRecipeStepUpdate: React.Dispatch<React.SetStateAction<RecipeStep | null>>;
}

const RecipeStepCard: FC<RecipeCardProps> = ({
  handleUpdateStepText,
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
              <Button color="red" title="Downies" />
              <View style={{ marginLeft: 4 }}>
                <Button color="green" title="Uppies" />
              </View>
            </View>
            <Pressable>
              <View>
                <Text>Close</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
};
