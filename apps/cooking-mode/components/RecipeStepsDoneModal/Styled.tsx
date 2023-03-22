import { FC, PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ModalOuterWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 10,
        height: "98%",
        margin: 8,
        padding: 8,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export const ModalHeadingText: FC<PropsWithChildren> = ({ children }) => {
  return <Text style={{ fontSize: 20, fontWeight: "500" }}>{children}</Text>;
};

export const HeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};

export const ContentWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export const FooterWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};
