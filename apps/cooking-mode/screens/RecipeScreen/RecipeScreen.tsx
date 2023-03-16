import MDIcon from "@expo/vector-icons/MaterialIcons";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { IconButton, Menu } from "react-native-paper";
import uuid from "react-native-uuid";

import { useAppDispatch, useAppSelector } from "@hooks";
import { deleteRecipe, updateRecipe } from "@store";
import { Recipe, RecipeStep, RecipeScreenNavigationProps } from "@types";
import { deleteLocalStorageRecipe, updateLocalStorageRecipe } from "@utils";

import {
  BigTagWrapper,
  ExpandedRecipeCardFooterWrapper,
  HeaderWrapper,
  InnerModalContainerWrapper,
  MainCardWrapper,
  OuterModalContainerWrapper,
  RecipeActionButtonWrapper,
  RecipeStepTypeSelectorWrapper,
  RecipeStepTypeWrapper,
  RecipeStepTextWrapper,
  RecipeStepWrapper,
  RecipeTagsWrapper,
  RootWrapper,
  StyledTextInput,
} from "./Styled";

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

  const [recipeDescription, setRecipeDescription] = useState<string>("");
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([]);

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedRecipeStep, setSelectedRecipeStep] =
    useState<RecipeStep | null>(null);

  const [isAddRecipeStepModalOpen, setIsAddRecipeStepModalOpen] =
    useState<boolean>(false);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [newStepData, setNewStepData] = useState<{
    description: string;
    duration?: number;
    type?: "cook" | "prep";
  }>({ description: "" });

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

  const handleRecipeDelete = (recipeId: string) => {
    setIsMenuOpen(() => false);

    setTimeout(async () => {
      navigation.navigate("Home");

      dispatch(deleteRecipe(recipeId));

      await deleteLocalStorageRecipe(recipeId);

      ToastAndroid.show("Recipe deleted", ToastAndroid.LONG);
    }, 200);
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
          setIsAddRecipeStepModalOpen(() => false);
        }}
        transparent
        visible={isAddRecipeStepModalOpen}
      >
        <OuterModalContainerWrapper>
          <InnerModalContainerWrapper>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Add New Step
              </Text>
              <StyledTextInput
                defaultValue={newStepData.description}
                multiline
                onChangeText={(newStepDescription) =>
                  setNewStepData((data) => ({
                    ...data,
                    description: newStepDescription,
                  }))
                }
                placeholder="Step Description"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <StyledTextInput
                  defaultValue={
                    !!newStepData.duration
                      ? `${newStepData.duration} minutes`
                      : ""
                  }
                  editable={false}
                  isFlex
                  placeholder="Step Duration"
                />
                <Button
                  color="red"
                  disabled={!newStepData.duration}
                  onPress={() => {
                    setNewStepData((data) => ({
                      ...data,
                      duration: !!data.duration ? data.duration - 1 : 0,
                    }));
                  }}
                  title="Downies!"
                />
                <View style={{ marginLeft: 8 }}>
                  <Button
                    color="green"
                    onPress={() => {
                      setNewStepData((data) => ({
                        ...data,
                        duration: !!data.duration ? data.duration + 1 : 1,
                      }));
                    }}
                    title="Uppies!"
                  />
                </View>
              </View>
            </View>
            <RecipeStepTypeSelectorWrapper>
              <Pressable
                onPress={() => {
                  setNewStepData((data) => ({ ...data, type: "prep" }));
                }}
                style={{ flex: 1, marginRight: 4 }}
              >
                <RecipeStepTypeWrapper isSelected={newStepData.type === "prep"}>
                  <Text>Prep</Text>
                </RecipeStepTypeWrapper>
              </Pressable>
              <Pressable
                onPress={() => {
                  setNewStepData((data) => ({ ...data, type: "cook" }));
                }}
                style={{ flex: 1, marginLeft: 4 }}
              >
                <RecipeStepTypeWrapper isSelected={newStepData.type === "cook"}>
                  <Text>Cook</Text>
                </RecipeStepTypeWrapper>
              </Pressable>
            </RecipeStepTypeSelectorWrapper>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                color="orange"
                onPress={() => {
                  setIsAddRecipeStepModalOpen(() => false);

                  setNewStepData(() => ({ description: "" }));
                }}
                title="Cancel"
              />
              <View style={{ marginLeft: 8 }}>
                <Button
                  color="green"
                  disabled={!newStepData.description}
                  onPress={() => {
                    setRecipeSteps((recipeSteps) => [
                      ...recipeSteps,
                      { ...newStepData, id: uuid.v4() as string },
                    ]);

                    setNewStepData(() => ({ description: "" }));

                    setIsUpdateNeeded(() => true);

                    setIsAddRecipeStepModalOpen(() => false);
                  }}
                  title="Save"
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
            <Menu
              anchor={
                <IconButton
                  icon="dots-vertical"
                  mode="contained"
                  onPress={() => {
                    setIsMenuOpen(() => true);
                  }}
                />
              }
              anchorPosition="bottom"
              onDismiss={() => {
                setIsMenuOpen(() => false);
              }}
              visible={isMenuOpen}
            >
              <Menu.Item
                leadingIcon="delete"
                onPress={() => {
                  handleRecipeDelete(targetRecipe?.id!);
                }}
                title="Delete Recipe"
              />
            </Menu>
          </HeaderWrapper>
          <RecipeTagsWrapper>
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
                }, 0)}
                {"  "}
                min cook time
              </Text>
            </View>
          </RecipeTagsWrapper>
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
              handleDeleteStep={(idx: number) => {
                setRecipeSteps((steps) => [
                  ...steps.slice(0, idx),
                  ...steps.slice(idx + 1),
                ]);

                setIsUpdateNeeded(() => true);
              }}
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
              setIsAddRecipeStepModalOpen(() => true);
            }}
            title="Add Step"
          />
          {!!targetRecipe?.steps.length && (
            <RecipeActionButtonWrapper>
              <Button title="Start" />
            </RecipeActionButtonWrapper>
          )}
        </MainCardWrapper>
      </ScrollView>
    </RootWrapper>
  );
};

interface RecipeCardProps {
  handleDeleteStep: (idx: number) => void;
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
  handleDeleteStep,
  handleUpdateStepText,
  handleUpdateStepDetails,
  idx,
  isFirst,
  isLast,
  recipeStep,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState<boolean>(false);

  return (
    <Pressable
      onLongPress={() =>
        isExpanded ? () => {} : setIsExpanded((isExpanded) => !isExpanded)
      }
    >
      <Modal transparent visible={isDeleteConfirmationModalOpen}>
        <OuterModalContainerWrapper>
          <InnerModalContainerWrapper>
            <View>
              <Text>Deleting</Text>
              <Text>{recipeStep.description}</Text>
              <Text>{recipeStep.duration} minutes</Text>
              <Text>{recipeStep.type}</Text>
              <Button
                color="red"
                onPress={() => {
                  handleDeleteStep(idx);
                }}
                title="Really Delete"
              />
            </View>
          </InnerModalContainerWrapper>
        </OuterModalContainerWrapper>
      </Modal>
      <RecipeStepWrapper isFirst={isFirst} isLast={isLast}>
        <RecipeStepTextWrapper>
          <StyledTextInput
            defaultValue={recipeStep.description}
            editable={isExpanded}
            isMargin
            multiline
            onChangeText={(newText) => handleUpdateStepText(newText, idx)}
            placeholder="Step Description"
          />
        </RecipeStepTextWrapper>
        {!!isExpanded && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <StyledTextInput
                defaultValue={
                  !!recipeStep.duration ? `${recipeStep.duration} minutes` : ""
                }
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
                  title="Uppies!"
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
                <RecipeStepTypeWrapper isSelected={recipeStep.type === "prep"}>
                  <Text>Prep</Text>
                </RecipeStepTypeWrapper>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleUpdateStepDetails({ idx, type: "cook" });
                }}
                style={{ flex: 1, marginLeft: 4 }}
              >
                <RecipeStepTypeWrapper isSelected={recipeStep.type === "cook"}>
                  <Text>Cook</Text>
                </RecipeStepTypeWrapper>
              </Pressable>
            </View>
            <ExpandedRecipeCardFooterWrapper>
              <Button
                color="red"
                onPress={() => {
                  setIsDeleteConfirmationModalOpen(() => true);
                }}
                title="Delete"
              />
              <Pressable
                onPress={() => {
                  setIsExpanded(() => false);
                }}
              >
                <MDIcon name="expand-less" size={32} />
              </Pressable>
            </ExpandedRecipeCardFooterWrapper>
          </View>
        )}
      </RecipeStepWrapper>
    </Pressable>
  );
};
