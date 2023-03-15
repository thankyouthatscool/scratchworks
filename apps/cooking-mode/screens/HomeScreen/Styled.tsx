import { FC, ComponentPropsWithoutRef } from "react";
import { FAB } from "react-native-paper";

export const StyledFloatingButton: FC<ComponentPropsWithoutRef<typeof FAB>> = (
  props
) => {
  return (
    <FAB
      {...props}
      style={{ position: "absolute", right: 0, bottom: 0, margin: 16 }}
    />
  );
};
