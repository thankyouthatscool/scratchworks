import { FC, PropsWithChildren, ComponentPropsWithoutRef } from "react";
import { Dimensions, FlatList, Text, TextInput, View } from "react-native";

const { height } = Dimensions.get("window");

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View style={{ marginRight: 8 }}>{children}</View>
);

export const SearchBarWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View
    style={{
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 8,
      marginBottom: 4,
    }}
  >
    {children}
  </View>
);

export const SearchTextInput: FC<ComponentPropsWithoutRef<typeof TextInput>> = (
  props
) => <TextInput {...props} style={{ flex: 1, padding: 4 }} />;

export const WarehouseStorageWrapper: FC<PropsWithChildren> = ({
  children,
}) => <View style={{ height }}>{children}</View>;
