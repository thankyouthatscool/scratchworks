import MDIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { FC, useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setIsRecipeStepsDoneModalOpen, setSelectedRecipe } from "@store";
import { Recipe, RecipeLog, RecipePlayerScreenNavProps } from "@types";
import { saveLocalStorageRecipeLog } from "@utils";

import {
  ContentWrapper,
  FooterWrapper,
  HeaderWrapper,
  ImageWrapper,
  ModalHeadingText,
  ModalOuterWrapper,
} from "./Styled";
import { TextInput } from "react-native-gesture-handler";

export const RecipeStepsDoneModal: FC<{
  nav: RecipePlayerScreenNavProps;
}> = ({ nav }) => {
  const dispatch = useAppDispatch();

  const { isRecipeStepsDoneModalOpen, selectedRecipe, recipes } =
    useAppSelector(({ app, recipes }) => ({
      ...app,
      ...recipes,
    }));

  const [recipeLogData, setRecipeLogData] = useState<RecipeLog>({
    comments: "",
    date: new Date(),
    pictures: [],
    rating: 0,
    recipeId: undefined,
  });
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );

      setRecipeLogData((data) => ({ ...data, recipeId: selectedRecipe }));
    }
  }, [selectedRecipe]);

  const handlePickImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync();

    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!res.canceled) {
        console.log(res);

        setRecipeLogData((data) => ({
          ...data,
          pictures: Array.from(new Set([...data.pictures, res.assets[0].uri])),
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

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
              setRecipeLogData((data) => ({ ...data, rating: e }));
            }}
          />
          <TextInput
            multiline
            onChangeText={(newRecipeLogComments) => {
              setRecipeLogData((data) => ({
                ...data,
                comments: newRecipeLogComments,
              }));
            }}
            numberOfLines={4}
            placeholder="Comments"
            style={{ textAlignVertical: "top" }}
          />
          <Button
            mode="contained"
            onPress={() => {
              handlePickImage();
            }}
          >
            Add Image/s
          </Button>
          {!!recipeLogData.pictures.length && (
            <ImageWrapper>
              {recipeLogData.pictures.map((pic) => (
                <Pressable
                  key={pic}
                  onLongPress={() => {
                    setRecipeLogData((data) => ({
                      ...data,
                      pictures: data.pictures.filter((p) => p !== pic),
                    }));
                  }}
                >
                  <Image
                    source={pic}
                    style={{
                      flex: 1,
                      width: "50%",
                      height: 200,
                    }}
                    transition={100}
                  />
                </Pressable>
              ))}
            </ImageWrapper>
          )}
          <Text>Food Used/Foods Remaining</Text>
        </ContentWrapper>
        <FooterWrapper>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                dispatch(setIsRecipeStepsDoneModalOpen(false));

                dispatch(setSelectedRecipe(null));

                nav.navigate("Home");
              }}
            >
              Close
            </Button>
            <Button
              disabled={!recipeLogData.comments || !recipeLogData.rating}
              mode="contained"
              onPress={async () => {
                await saveLocalStorageRecipeLog(recipeLogData);

                dispatch(setIsRecipeStepsDoneModalOpen(false));

                dispatch(setSelectedRecipe(null));

                nav.navigate("Home");
              }}
              style={{ marginLeft: 8 }}
            >
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
  );
};
