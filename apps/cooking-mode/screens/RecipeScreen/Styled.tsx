import { ComponentPropsWithoutRef, FC, PropsWithChildren } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const RootWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};

export const MainCardWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 2,
        margin: 8,
        padding: 8,
      }}
    >
      {children}
    </View>
  );
};

export const HeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};

export const StyledTextInput: FC<ComponentPropsWithoutRef<typeof TextInput>> = (
  props
) => <TextInput {...props} style={{ color: "black" }} />;
