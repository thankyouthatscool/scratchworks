import { FC, PropsWithChildren, ComponentPropsWithoutRef } from "react";
import { Text, TextInput, View } from "react-native";

export const HeaderWrapper: FC<PropsWithChildren> = ({ children }) => (
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

export const LocationItemWrapper: FC<
  PropsWithChildren & { index: number; isPressed: boolean }
> = ({ children, index, isPressed }) => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 5,
      elevation: isPressed ? 0 : 2,
      marginHorizontal: 8,
      marginTop: index === 0 ? 4 : 0,
      marginBottom: 8,
      padding: 8,
    }}
  >
    {children}
  </View>
);

export const LocationItemFormTextInput: FC<
  PropsWithChildren & ComponentPropsWithoutRef<typeof TextInput>
> = (props) => (
  <TextInput
    {...props}
    style={{
      paddingHorizontal: 8,
      paddingVertical: 4,
    }}
  />
);

export const HeaderButtonContainer: FC<PropsWithChildren> = ({ children }) => (
  <View style={{ flexDirection: "row" }}>{children}</View>
);

export const HeaderText: FC<PropsWithChildren> = ({ children }) => (
  <Text style={{ fontSize: 16 * 1.5, fontWeight: "500" }}>{children}</Text>
);

export const LocationItemFormWrapper: FC<PropsWithChildren> = ({
  children,
}) => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 5,
      elevation: 10,
      margin: 8,
      marginTop: 8,
    }}
  >
    {children}
  </View>
);
