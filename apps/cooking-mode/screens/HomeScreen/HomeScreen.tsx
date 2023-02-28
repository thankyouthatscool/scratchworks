import { FC } from "react";
import { Button, Text, View } from "react-native";

import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { HomeScreenNavigationProps } from "@types";

import { TagSelectorComponent } from "@components/TagSelectorComponent";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <TagSelectorComponent />
    </ScreenWrapper>
  );
};
