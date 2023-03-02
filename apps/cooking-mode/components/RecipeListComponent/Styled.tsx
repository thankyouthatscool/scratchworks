import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const RecipeTagsComponentWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
};
