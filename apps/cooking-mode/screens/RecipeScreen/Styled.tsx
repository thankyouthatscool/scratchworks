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

export const StyledTextInput: FC<
  ComponentPropsWithoutRef<typeof TextInput> & {
    isHeading?: boolean;
    isMargin?: boolean;
  }
> = ({ isHeading, isMargin, ...props }) => (
  <TextInput
    {...props}
    style={{
      color: "black",
      fontSize: !!isHeading ? 20 : 14,
      fontWeight: !!isHeading ? "500" : "400",
      maxHeight: 200,
      ...(!!isMargin && { marginVertical: 8 }),
    }}
  />
);

export const BigTagWrapper: FC<
  PropsWithChildren & { isSelectedTag: boolean }
> = ({ children, isSelectedTag }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderColor: !!isSelectedTag ? "green" : "white",
        borderRadius: 5,
        borderWidth: 1,
        elevation: 2,
        padding: 2,
        marginRight: 4,
      }}
    >
      {children}
    </View>
  );
};
