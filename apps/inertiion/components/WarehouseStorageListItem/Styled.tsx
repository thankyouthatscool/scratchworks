import { FC, PropsWithChildren } from "react";
import { Text } from "react-native";

export const ListItemHeading: FC<PropsWithChildren> = ({ children }) => (
  <Text style={{ fontSize: 16 * 1.25, fontWeight: "500" }}>{children}</Text>
);
