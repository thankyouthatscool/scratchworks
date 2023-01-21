import Toast from "react-native-root-toast";

const defaultToastSettings = {
  animation: true,
  duration: Toast.durations.SHORT,
  hideOnPress: true,
  position: Toast.positions.BOTTOM,
  shadow: true,
};

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again later.";

interface ShowToastProps {
  message: "GENERIC_ERROR_MESSAGE" | string;
  options?: {
    animation?: boolean;
    duration?: "short" | "long" | number;
    hideOnPress?: boolean;
    shadow?: boolean;
  };
}

export const useToast = () => {
  return {
    showToast: ({ message, options }: ShowToastProps) => {
      Toast.show(
        message === "GENERIC_ERROR_MESSAGE" ? GENERIC_ERROR_MESSAGE : message,
        {
          ...defaultToastSettings,
          animation: !!options?.animation,

          duration:
            typeof options?.duration === "number"
              ? options.duration
              : options?.duration === "long"
              ? Toast.durations.LONG
              : Toast.durations.SHORT,
          hideOnPress: !!options?.hideOnPress,
          shadow: !!options?.shadow,
        }
      );
    },
  };
};
