import { FC, PropsWithChildren, ComponentPropsWithoutRef } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";

const { height, width } = Dimensions.get("window");

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

export const ModalWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "red",
      padding: 8,
      width: width * 0.75,
    }}
  >
    {children}
  </View>
);

export const OuterModalWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View
    style={{
      alignItems: "center",
      height: "100%",
      justifyContent: "center",
    }}
  >
    {children}
  </View>
);

export const ModalSectionWrapper: FC<PropsWithChildren> = ({ children }) => (
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
