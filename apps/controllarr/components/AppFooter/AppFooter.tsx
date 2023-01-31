import { FC, useEffect, useRef } from "react";
import { Animated, Dimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FOOTER_HEIGHT = 35;

const { height } = Dimensions.get("window");

export const AppFooter: FC<{ movementDir: boolean }> = ({ movementDir }) => {
  const { top } = useSafeAreaInsets();

  const footerTranslateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(footerTranslateAnim, {
      bounciness: 15,
      speed: 15,
      toValue: !!movementDir ? height + FOOTER_HEIGHT : height + 2,
      useNativeDriver: true,
    }).start();
  }, [footerTranslateAnim, movementDir, top]);

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        elevation: 25,
        padding: 8,
        position: "absolute",
        transform: [{ translateY: footerTranslateAnim }],
        width: "100%",
        zIndex: 2,
      }}
    >
      <Text>Footer</Text>
    </Animated.View>
  );
};
