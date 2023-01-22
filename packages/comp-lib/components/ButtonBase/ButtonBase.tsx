import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { FC, ComponentPropsWithoutRef } from "react";
import { Button, Pressable, Text } from "react-native";

interface ButtonBase {
  icon?: "delete" | "pause" | "play-arrow";
  buttonType?: "danger" | "primary" | "secondary";
  title?: string;
}

const APP_PADDING = 8;
const BORDER_RADIUS = 5;
const ELEVATION = 4;
const FONT_SIZE = 14;
const ICON_SIZE = 20;
const ICON_NEGATIVE_MARGIN = -8;

export const ButtonBase: FC<
  ButtonBase & ComponentPropsWithoutRef<typeof Pressable>
> = ({
  disabled,
  icon,
  buttonType = "primary",
  onLongPress,
  onPress,
  style,
  title = "",
}) => {
  if (buttonType === "primary") {
    return (
      <Pressable
        onLongPress={disabled ? null : onLongPress}
        onPress={disabled ? null : onPress}
        style={({ pressed }) => ({
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: disabled ? "grey" : "white",
          borderRadius: BORDER_RADIUS,
          elevation: pressed ? 1 : ELEVATION,
          flexDirection: "row",
          padding: APP_PADDING,
          //   @ts-ignore
          ...style,
        })}
      >
        {!!icon && (
          <MaterialIcons
            color={icon === "delete" ? "red" : "black"}
            name={icon}
            size={ICON_SIZE}
            style={{
              marginLeft: ICON_NEGATIVE_MARGIN,
              marginRight: !!title ? 0 : ICON_NEGATIVE_MARGIN,
            }}
          />
        )}
        <Text style={{ fontSize: FONT_SIZE }}>{title}</Text>
      </Pressable>
    );
  }

  if (buttonType === "danger") {
    return (
      <Pressable
        onLongPress={disabled ? null : onLongPress}
        onPress={disabled ? null : onPress}
        style={({ pressed }) => ({
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: disabled ? "grey" : "red",
          borderRadius: BORDER_RADIUS,
          elevation: pressed ? 1 : ELEVATION,
          flexDirection: "row",
          padding: APP_PADDING,
          //   @ts-ignore
          ...style,
        })}
      >
        <Text style={{ color: "white", fontSize: FONT_SIZE }}>{title}</Text>
      </Pressable>
    );
  }

  return <Button title="yes" />;
};
