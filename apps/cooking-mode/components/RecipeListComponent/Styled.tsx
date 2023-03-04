import { isAsyncThunkAction } from "@reduxjs/toolkit";
import { FC, PropsWithChildren } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

const { width } = Dimensions.get("screen");

export const RecipeCardComponentWrapper: FC<
  PropsWithChildren & {
    index: number;
    pressedIn: boolean;
  }
> = ({ children, index, pressedIn }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: !!pressedIn ? 0 : 2,
        marginBottom: 4,
        marginRight: !(index % 2) ? 4 : 0,
        padding: 4,
        width: width / 2 - 8 - 2,

        // flex: 1,

        // height: 200,

        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};

export const RecipeTagsComponentWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {children}
    </View>
  );
};

export const TagWrapper: FC<PropsWithChildren & { isSelected: boolean }> = ({
  children,
  isSelected,
}) => {
  return (
    <View
      style={{
        padding: 2,
        marginRight: 4,
        borderRadius: 5,
        marginBottom: 4,
        backgroundColor: "white",
        elevation: 2,
        borderWidth: 1,
        borderColor: !!isSelected ? "green" : "white",
      }}
    >
      {children}
    </View>
  );
};

export const TagWrapperText: FC<
  PropsWithChildren & { isSelected: boolean }
> = ({ children, isSelected }) => (
  <Text
    style={{
      color: isSelected ? "green" : "grey",
      fontSize: 10,
      fontWeight: `${!!isSelected ? 5 : 4}00`,
    }}
  >
    {children}
  </Text>
);

export const RootWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 8,
        paddingTop: 2,
      }}
    >
      {children}
    </ScrollView>
  );
};
