import { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const ScreenWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView style={{ height: "100%" }}>{children}</SafeAreaView>;
};
