import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ButtonBase } from "@scratchworks/comp-lib";
import { Pressable, Text, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setBottomSheetState, setTorrents } from "@store";
import { APP_HEADER_FONT } from "@theme";
import { trpc } from "@utils";

export const AppHeader = () => {
  const dispatch = useAppDispatch();

  const { torrents } = useAppSelector(({ app }) => app);

  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const { mutateAsync: pauseTorrent } =
    trpc.controllarr.pauseTorrent.useMutation();

  const { mutateAsync: resumeTorrent } =
    trpc.controllarr.resumeTorrent.useMutation();

  const { mutateAsync: deleteTorrent } =
    trpc.controllarr.deleteTorrent.useMutation();

  const handleRefreshTorrents = async () => {
    const res = await getAllTorrents();

    dispatch(setTorrents(res));
  };

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 8,
        marginTop: 8,
      }}
    >
      <Text
        style={{
          fontSize: 16 * 1.5,
          color: APP_HEADER_FONT,
          fontWeight: "500",
        }}
      >
        All Downloads
      </Text>
      <Pressable>
        <MaterialIcons
          color={APP_HEADER_FONT}
          name="settings"
          onPress={() => {
            dispatch(setBottomSheetState(true));
          }}
          size={30}
        />
      </Pressable>
    </View>
  );
};
