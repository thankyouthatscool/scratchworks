import { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ScreenWrapperProps {
  isPadded?: boolean;
}

export const ScreenWrapper: FC<PropsWithChildren & ScreenWrapperProps> = ({
  children,
  isPadded,
}) => {
  return (
    <SafeAreaView
      style={{
        height: "100%",
        padding: isPadded ? 8 : 0,
      }}
    >
      {children}
    </SafeAreaView>
  );
};
