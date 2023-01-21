import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { FC, ComponentPropsWithoutRef, useRef } from "react";
import { Pressable, Text, View } from "react-native";

type ConfirmButtonProps = {
  buttonType?: "danger" | "primary" | "secondary";
  title?: string;
};

export const ConfirmButton: FC<
  ConfirmButtonProps & ComponentPropsWithoutRef<typeof Pressable>
> = ({ buttonType = "primary", style, title = "" }) => {
  if (buttonType === "danger") {
    return (
      <Pressable
        style={({ pressed }) => ({
          alignSelf: "flex-end",
          backgroundColor: "red",
          borderRadius: 5,
          elevation: pressed ? 0 : 5,
          padding: 4,
          // @ts-ignore
          ...style,
        })}
      >
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <MaterialIcons color="white" name="delete" size={15} />
          <Text style={{ color: "white", fontWeight: "500" }}>{title}</Text>
        </View>
      </Pressable>
    );
  }

  if (buttonType === "secondary") {
    return (
      <View>
        <Text>{title}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
