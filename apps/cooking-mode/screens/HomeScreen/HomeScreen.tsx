import { FC } from "react";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Button, Text } from "react-native";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { RootDrawerNavigatorProps } from "@types";

type HomeScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "Home"
>;

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
