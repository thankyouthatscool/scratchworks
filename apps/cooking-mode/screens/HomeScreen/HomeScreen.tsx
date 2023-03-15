import { FC } from "react";

import { AddNewRecipeModal } from "@components/AddNewRecipeModal";
import { RecipesControlBar } from "@components/RecipesControlBar";
import { RecipeListComponent } from "@components/RecipeListComponent";
import { ScreenWrapper } from "@components/shared/ScreenWrapper";
import { TagSelectorComponent } from "@components/TagSelectorComponent";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setIsAddNewRecipeModalOpen } from "@store";
import { HomeScreenNavigationProps } from "@types";

import { StyledFloatingButton } from "./Styled";

export const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { isAddNewRecipeModalOpen } = useAppSelector(({ app }) => app);

  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <AddNewRecipeModal />
      <RecipesControlBar />
      <RecipeListComponent nav={navigation} />
      <StyledFloatingButton
        icon="plus"
        onPress={() => {
          dispatch(setIsAddNewRecipeModalOpen(true));
        }}
        visible={!isAddNewRecipeModalOpen}
      />
    </ScreenWrapper>
  );
};
