import { FC, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { useAppSelector } from "@hooks";
import { Recipe, RecipePlayerScreenNavigationProps } from "@types";

export const RecipePlayerScreen: FC<RecipePlayerScreenNavigationProps> = ({
  navigation,
}) => {
  const { recipes, selectedRecipe } = useAppSelector(({ recipes }) => recipes);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    }
  }, [recipes, selectedRecipe]);

  return (
    <ScreenWrapper isPadded>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        Home
      </Button>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Text>{targetRecipe?.name}</Text>
          <Text>{targetRecipe?.steps[currentStep].duration}</Text>
          <Text>{targetRecipe?.steps[currentStep].type}</Text>
          <Text>{targetRecipe?.steps[currentStep].description}</Text>
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          disabled={!currentStep}
          mode="contained"
          onPress={() => {
            setCurrentStep((currentStep) =>
              currentStep === 0 ? 0 : currentStep - 1
            );
          }}
        >
          Prev
        </Button>
        {!!targetRecipe?.steps[currentStep].duration && (
          <Button mode="contained-tonal">Start Timer</Button>
        )}
        <Button
          disabled={
            !!targetRecipe
              ? currentStep === targetRecipe.steps.length - 1
              : true
          }
          mode="contained"
          onPress={() => {
            setCurrentStep((currentStep) =>
              currentStep < targetRecipe?.steps.length! - 1
                ? currentStep + 1
                : currentStep
            );
          }}
        >
          Next
        </Button>
      </View>
    </ScreenWrapper>
  );
};
