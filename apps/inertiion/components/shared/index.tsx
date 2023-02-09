import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View style={{ marginRight: 8 }}>{children}</View>
);
