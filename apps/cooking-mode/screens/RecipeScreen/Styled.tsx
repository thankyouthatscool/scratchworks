import { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const RootWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};
