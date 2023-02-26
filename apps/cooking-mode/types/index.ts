import { DrawerScreenProps } from "@react-navigation/drawer";

export type RootDrawerNavigatorProps = {
  Home: undefined;
  Settings: undefined;
};

export type HomeScreenNavigationProps = DrawerScreenProps<
  RootDrawerNavigatorProps,
  "Home"
>;
