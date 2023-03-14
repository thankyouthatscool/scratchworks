import { FC, PropsWithChildren } from "react";
import { Text, View } from "react-native";

export const RecipeControlBarRootWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
        marginHorizontal: 8,
        padding: 8,
      }}
    >
      {children}
    </View>
  );
};

export const RecipeControlBarTextWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  return <View>{children}</View>;
};

export const RecipeControlBarText: FC<PropsWithChildren> = ({ children }) => {
  return <Text style={{ fontWeight: "500" }}>{children}</Text>;
};
