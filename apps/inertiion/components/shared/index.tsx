import { FC, PropsWithChildren } from "react";
import { Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => (
  <View style={{ marginRight: 8 }}>{children}</View>
);

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
