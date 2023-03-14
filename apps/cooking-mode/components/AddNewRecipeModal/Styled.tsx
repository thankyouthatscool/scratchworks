import { FC, PropsWithChildren, ComponentPropsWithoutRef } from "react";
import { Dimensions, Pressable, View } from "react-native";

const { width } = Dimensions.get("screen");

export const AddNewRecipeModalOuterWrapper: FC<
  PropsWithChildren &
    ComponentPropsWithoutRef<typeof Pressable> & { onOuterPress: () => void }
> = ({ children, onOuterPress }) => {
  return (
    <Pressable onPress={onOuterPress}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          height: "100%",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </Pressable>
  );
};

export const AddNewRecipeModalInnerWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 10,
        padding: 16,
        width: width * 0.85,
      }}
    >
      {children}
    </View>
  );
};

export const AddNewRecipeModalFooterButtonContainer: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {children}
    </View>
  );
};
