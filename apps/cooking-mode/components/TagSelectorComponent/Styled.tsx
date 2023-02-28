import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const ComponentWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ marginVertical: 8 }}>{children}</View>;
};
