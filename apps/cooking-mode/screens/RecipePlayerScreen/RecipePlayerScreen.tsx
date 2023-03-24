import AsyncStorage from "@react-native-async-storage/async-storage";
import { intervalToDuration } from "date-fns";
import { FC, useCallback, useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import uuid from "react-native-uuid";

import { RecipeStepsDoneModal } from "@components/RecipeStepsDoneModal";
import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setIsRecipeStepsDoneModalOpen } from "@store";
import { Recipe, RecipePlayerScreenNavigationProps } from "@types";

export const RecipePlayerScreen: FC<RecipePlayerScreenNavigationProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const { isAppVisible, recipes, selectedRecipe } = useAppSelector(
    ({ app, recipes }) => ({
      ...app,
      ...recipes,
    })
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  // Timer Related
  const [initialTimeRemaining, setInitialTimeRemaining] = useState<
    number | undefined
  >(undefined);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined
  );
  const [timerKey, setTimerKey] = useState(uuid.v4() as string);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const handleResetTimer = (resetAction?: "resume" | "pause") => {
    setInitialTimeRemaining(() => timeRemaining!);

    setTimerKey(() => uuid.v4() as string);

    setIsTimerRunning(() => (resetAction === "resume" ? true : false));
  };

  const handleTimerAppResume = useCallback(async () => {
    if (!!isTimerRunning) {
      const lastOutTimeString = await AsyncStorage.getItem("outTime");

      const lastOutTime = new Date(lastOutTimeString!);

      const inTime = new Date();

      const { hours, minutes, seconds } = intervalToDuration({
        start: lastOutTime,
        end: inTime,
      });

      setInitialTimeRemaining(() =>
        Math.floor(remainingTime! - (hours! * 3600 + minutes! * 60 + seconds!))
      );

      setTimerKey(() => uuid.v4() as string);
    }
  }, [isTimerRunning, remainingTime]);

  const handleTimerAppExit = useCallback(async () => {
    if (!!isTimerRunning) {
      await AsyncStorage.setItem("outTime", new Date().toLocaleString());
    }
  }, [isTimerRunning]);

  useEffect(() => {
    setCurrentStep(() => 0);
  }, [selectedRecipe]);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    }
  }, [recipes, selectedRecipe]);

  useEffect(() => {
    if (!!isAppVisible) {
      handleTimerAppResume();
    } else {
      handleTimerAppExit();
    }
  }, [isAppVisible]);

  useEffect(() => {
    if (!!targetRecipe) {
      setTimeRemaining(() => targetRecipe.steps[currentStep]?.duration || 0);
    }
  }, [targetRecipe, currentStep]);

  return (
    <ScreenWrapper isPadded>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            {targetRecipe?.name}
          </Text>
          <Text>Duration: {targetRecipe?.steps[currentStep]?.duration}</Text>
          <Text>Type: {targetRecipe?.steps[currentStep]?.type}</Text>
          <Text>{targetRecipe?.steps[currentStep]?.description}</Text>
        </ScrollView>
      </View>
      {!!timeRemaining && (
        <View
          style={{
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <CountdownCircleTimer
            isPlaying={isAppVisible && isTimerRunning}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[60, 30, 10, 0]}
            duration={timeRemaining || 0}
            initialRemainingTime={initialTimeRemaining || timeRemaining || 0}
            key={timerKey}
            onUpdate={(e) => {
              setRemainingTime(() => e);
            }}
            size={88}
            onComplete={() => handleResetTimer("pause")}
          >
            {({ remainingTime }) => {
              const toHHMMSS = (numSeconds: number) => {
                const hours = Math.floor(numSeconds / 3600);
                const minutes = Math.floor((numSeconds - hours * 3600) / 60);
                const seconds = numSeconds - hours * 3600 - minutes * 60;

                return `${!!minutes ? `${minutes} m ` : ""}${seconds}s`;
              };

              return <Text>{toHHMMSS(remainingTime)}</Text>;
            }}
          </CountdownCircleTimer>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          disabled={!currentStep}
          mode="contained-tonal"
          onPress={() => {
            setCurrentStep((currentStep) =>
              currentStep === 0 ? 0 : currentStep - 1
            );

            handleResetTimer("pause");
          }}
        >
          Prev
        </Button>
        {isTimerRunning && (
          <Button onPress={() => handleResetTimer("pause")}>Reset</Button>
        )}
        {!!targetRecipe?.steps[currentStep]?.duration && (
          <Button
            mode="contained-tonal"
            onPress={() => {
              setIsTimerRunning((isTimerRunning) => !isTimerRunning);
            }}
          >
            {!!isTimerRunning ? "Pause" : "Start"}
          </Button>
        )}
        {!!targetRecipe && currentStep !== targetRecipe.steps.length - 1 && (
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

              handleResetTimer("pause");
            }}
          >
            Next
          </Button>
        )}
        {currentStep === targetRecipe?.steps.length! - 1 && (
          <Button
            onPress={() => {
              console.log("opening the recipes steps done modal");
              dispatch(setIsRecipeStepsDoneModalOpen(true));
            }}
          >
            Done
          </Button>
        )}
      </View>
      <RecipeStepsDoneModal nav={navigation} />
    </ScreenWrapper>
  );
};
