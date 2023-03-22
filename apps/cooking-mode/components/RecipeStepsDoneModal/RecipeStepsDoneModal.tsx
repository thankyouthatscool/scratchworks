import MDIcons from "@expo/vector-icons/MaterialIcons";
import { FC, useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setIsRecipeStepsDoneModalOpen } from "@store";
import { Recipe } from "@types";

import {
  ContentWrapper,
  FooterWrapper,
  HeaderWrapper,
  ModalHeadingText,
  ModalOuterWrapper,
} from "./Styled";

export const RecipeStepsDoneModal = () => {
  const dispatch = useAppDispatch();

  const { isRecipeStepsDoneModalOpen, selectedRecipe, recipes } =
    useAppSelector(({ app, recipes }) => ({
      ...app,
      ...recipes,
    }));

  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    }
  }, [selectedRecipe]);

  return (
    <Modal
      animationType="slide"
      hardwareAccelerated
      transparent
      visible={isRecipeStepsDoneModalOpen}
    >
      <ModalOuterWrapper>
        <HeaderWrapper>
          <ModalHeadingText>{targetRecipe?.name}</ModalHeadingText>
          <ModalHeadingText>
            Log - {new Date().toLocaleString()}
          </ModalHeadingText>
        </HeaderWrapper>
        <ContentWrapper>
          <StarRatingComponent
            onRatingChange={(e) => {
              console.log("TTT", e);
            }}
          />
          <Text>Comments</Text>
          <Text>Pictures</Text>
          <Text>Food Used/Foods Remaining</Text>
        </ContentWrapper>
        <FooterWrapper>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                dispatch(setIsRecipeStepsDoneModalOpen(false));
              }}
            >
              Close
            </Button>
            <Button mode="contained" style={{ marginLeft: 8 }}>
              Save
            </Button>
          </View>
        </FooterWrapper>
      </ModalOuterWrapper>
    </Modal>
  );
};

export const StarRatingComponent: FC<{
  numberOfStars?: number;
  onRatingChange: (rating: number) => void;
}> = ({ numberOfStars, onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    if (!!selectedRating) {
      onRatingChange(selectedRating);
    }
  }, [selectedRating]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {Array.from({ length: numberOfStars || 5 }).map((_, idx) => (
        <Pressable key={idx} onPress={() => setSelectedRating(() => idx + 1)}>
          <MDIcons
            name={
              selectedRating && idx < selectedRating ? "star" : "star-border"
            }
            size={50}
          />
        </Pressable>
      ))}
    </View>

    // <Pressable style={{ borderWidth: 2, alignSelf: "flex-start" }}>

    //   {({ pressed }) => {
    //     return <MDIcons name={pressed ? "star" : "star-border"} size={50} />;
    //   }}
    // </Pressable>
  );
};
