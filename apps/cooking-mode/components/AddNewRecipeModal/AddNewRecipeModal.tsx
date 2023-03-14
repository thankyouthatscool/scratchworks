import { useCallback, useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import uuid from "react-native-uuid";

import { useAppDispatch, useAppSelector } from "@hooks";
import { addNewRecipe, setIsAddNewRecipeModalOpen } from "@store";
import { RecipeStep } from "@types";
import { addNewLocalStorageRecipe } from "@utils";

import {
  AddNewRecipeModalFooterButtonContainer,
  AddNewRecipeModalInnerWrapper,
  AddNewRecipeModalOuterWrapper,
} from "./Styled";

export const AddNewRecipeModal = () => {
  const dispatch = useAppDispatch();

  const [newRecipeData, setNewRecipeData] = useState<{
    name: string;
    description?: string;
    reactions: string[];
    steps: RecipeStep[];
    tags: string[];
  }>({
    name: "",
    reactions: ["🌟"],
    steps: [],
    tags: ["new"],
  });

  const { isAddNewRecipeModalOpen } = useAppSelector(({ app }) => app);

  const handleAddNewRecipe = useCallback(async () => {
    const newRecipeId = uuid.v4() as string;

    await addNewLocalStorageRecipe({
      ...newRecipeData,
      id: newRecipeId,
    });

    dispatch(addNewRecipe({ ...newRecipeData, id: newRecipeId }));

    dispatch(setIsAddNewRecipeModalOpen(false));
  }, [newRecipeData]);

  return (
    <Modal
      animationType="slide"
      hardwareAccelerated
      onRequestClose={() => {
        dispatch(setIsAddNewRecipeModalOpen(false));
      }}
      transparent
      visible={isAddNewRecipeModalOpen}
    >
      <AddNewRecipeModalOuterWrapper
        onOuterPress={() => {
          dispatch(setIsAddNewRecipeModalOpen(false));
        }}
      >
        <AddNewRecipeModalInnerWrapper>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            Add New Recipe
          </Text>
          <TextInput
            defaultValue={newRecipeData.name}
            multiline
            onChangeText={(newRecipeName) =>
              setNewRecipeData((data) => ({
                ...data,
                name: newRecipeName,
              }))
            }
            placeholder="Recipe Name"
          />
          <TextInput
            defaultValue={newRecipeData.description}
            multiline
            onChangeText={(newRecipeDescription) =>
              setNewRecipeData((data) => ({
                ...data,
                description: newRecipeDescription,
              }))
            }
            placeholder="Recipe Description"
          />
          <AddNewRecipeModalFooterButtonContainer>
            <Button
              color="orange"
              onPress={() => {
                dispatch(setIsAddNewRecipeModalOpen(false));
              }}
              title="Cancel"
            />
            <View style={{ marginLeft: 8 }}>
              <Button
                disabled={!newRecipeData.name}
                color="green"
                onPress={() => {
                  handleAddNewRecipe();
                }}
                title="Add"
              />
            </View>
          </AddNewRecipeModalFooterButtonContainer>
        </AddNewRecipeModalInnerWrapper>
      </AddNewRecipeModalOuterWrapper>
    </Modal>
  );
};
