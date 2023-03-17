import { FC, useState } from "react";
import { Menu } from "react-native-paper";

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

  const [isFABMenuOpen, setIsFABMenuOpen] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  return (
    <ScreenWrapper>
      <TagSelectorComponent />
      <AddNewRecipeModal />
      <RecipesControlBar />
      <RecipeListComponent nav={navigation} />
      <StyledFloatingButton
        icon="plus"
        onPress={({ nativeEvent: { pageX, pageY } }) => {
          setCoords(() => ({ x: pageX + 999, y: pageY + 999 }));
          setIsFABMenuOpen(() => true);
        }}
        visible={!isAddNewRecipeModalOpen}
      />
      <Menu
        anchor={coords}
        anchorPosition="bottom"
        onDismiss={() => setIsFABMenuOpen(() => false)}
        visible={isFABMenuOpen}
      >
        <Menu.Item
          leadingIcon="plus"
          onPress={() => {
            dispatch(setIsAddNewRecipeModalOpen(true));

            setIsFABMenuOpen(() => false);
          }}
          title="Add Recipe"
        />
      </Menu>
    </ScreenWrapper>
  );
};
