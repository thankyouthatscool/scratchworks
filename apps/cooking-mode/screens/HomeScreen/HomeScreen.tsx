import { FC } from "react";

import { AddNewRecipeModal } from "@components/AddNewRecipeModal";
import { RecipesControlBar } from "@components/RecipesControlBar";
import { RecipeListComponent } from "@components/RecipeListComponent";
import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { TagSelectorComponent } from "@components/TagSelectorComponent";
import { HomeScreenNavigationProps } from "@types";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <AddNewRecipeModal />
      <RecipesControlBar />
      <RecipeListComponent nav={navigation} />
    </ScreenWrapper>
  );
};
