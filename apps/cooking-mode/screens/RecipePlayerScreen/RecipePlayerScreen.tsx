import { FC, useCallback, useEffect, useReducer, useState } from "react";
import { AppState, ScrollView, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { intervalToDuration, add } from "date-fns";

import uuid from "react-native-uuid";

import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { useAppSelector } from "@hooks";
import { Recipe, RecipePlayerScreenNavigationProps } from "@types";

export const RecipePlayerScreen: FC<RecipePlayerScreenNavigationProps> = ({
  navigation,
}) => {
  const { isAppVisible, recipes, selectedRecipe } = useAppSelector(
    ({ app, recipes }) => ({
      ...app,
      ...recipes,
    })
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const [timerKey, setTimerKey] = useState(uuid.v4() as string);

  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    undefined
  );
  const [initialTimeRemaining, setInitialTimeRemaining] = useState<
    number | undefined
  >(undefined);

  const handleResetTimer = (resetAction?: "resume" | "pause") => {
    setTimeRemaining(() => timeRemaining);
    setInitialTimeRemaining(() => timeRemaining);

    setTimerKey(() => uuid.v4() as string);

    setIsTimerRunning(() => (resetAction === "resume" ? true : false));
  };

  const handleTimerAppResume = useCallback(async () => {
    if (!!isTimerRunning) {
      const lastOutTimeString = await AsyncStorage.getItem("outTime");

      const lastOutTime = new Date(lastOutTimeString!);

      const inTime = new Date();

      console.log(lastOutTime, inTime);

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
      setTimeRemaining(() => targetRecipe.steps[currentStep].duration!);
    }
  }, [targetRecipe, currentStep]);

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
      {!!timeRemaining && (
        <View
          style={{
            alignSelf: "flex-start",
            position: "absolute",
            bottom: 75,
            left: 100,
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
            onComplete={() => handleResetTimer("pause")}
          >
            {({ remainingTime }) => <Text>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Text>{targetRecipe?.name}</Text>
          <Text>Duration: {targetRecipe?.steps[currentStep].duration}</Text>
          <Text>Type: {targetRecipe?.steps[currentStep].type}</Text>
          <Text>{targetRecipe?.steps[currentStep].description}</Text>
          <Text>Time Remaining: {timeRemaining} </Text>
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

            handleResetTimer("pause");
          }}
        >
          Prev
        </Button>
        {isTimerRunning && (
          <Button onPress={() => handleResetTimer("pause")}>Reset</Button>
        )}
        {!!targetRecipe?.steps[currentStep].duration && (
          <Button
            mode="contained-tonal"
            onPress={() => {
              setIsTimerRunning((isTimerRunning) => !isTimerRunning);
            }}
          >
            {!!isTimerRunning ? "Stop" : "Start"}
          </Button>
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

            handleResetTimer("pause");
          }}
        >
          Next
        </Button>
      </View>
    </ScreenWrapper>
  );
};
