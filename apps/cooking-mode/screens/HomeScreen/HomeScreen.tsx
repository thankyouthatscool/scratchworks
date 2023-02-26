import { FC } from "react";
import { Button, Text } from "react-native";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { HomeScreenNavigationProps } from "@types";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <Button
        onPress={() => {
          navigation.navigate("Settings");
        }}
        title="settings"
      />
      <Text>It's GOBBLING TIME!!!</Text>
    </ScreenWrapper>
  );
};
