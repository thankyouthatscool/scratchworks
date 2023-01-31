import { FC, useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@hooks";

export const AppHeader: FC<{ movementDir: boolean }> = ({ movementDir }) => {
  const { headerHeight } = useAppSelector(({ app }) => app);

  const { top } = useSafeAreaInsets();

  const headerTranslateAnim = useRef(new Animated.Value(top)).current;

  useEffect(() => {
    Animated.spring(headerTranslateAnim, {
      bounciness: 10,
      speed: 10,
      toValue: !!movementDir ? top - headerHeight : top,
      useNativeDriver: true,
    }).start();
  }, [headerHeight, movementDir, top, headerTranslateAnim]);

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        elevation: 2,
        padding: 8,
        position: "absolute",
        transform: [{ translateY: headerTranslateAnim }],
        width: "100%",
        zIndex: 2,
      }}
    >
      <Text style={{ fontSize: 16 * 1.5 }}>All Torrents</Text>
    </Animated.View>
  );
};
