import { FC } from "react";

import { RecipeListComponent } from "@components/RecipeListComponent";
import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { TagSelectorComponent } from "@components/TagSelectorComponent";
import { HomeScreenNavigationProps } from "@types";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <RecipeListComponent nav={navigation} />
    </ScreenWrapper>
  );
};
