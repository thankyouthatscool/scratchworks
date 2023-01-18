import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Text, View } from "react-native";

const ICON_SIZE = 30;

export const AppHeader = () => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <MaterialIcons name="play-arrow" size={ICON_SIZE} />
        <MaterialIcons name="pause" size={ICON_SIZE} />
        <MaterialIcons color="red" name="delete" size={ICON_SIZE} />
      </View>
      <View style={{ marginRight: 8 }}>
        <Text>Auto Pause</Text>
      </View>
    </View>
  );
};
