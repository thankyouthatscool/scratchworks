import { ButtonBase } from "@scratchworks/comp-lib";
import { View } from "react-native";

import { useAppDispatch } from "@hooks";
import { setTorrents } from "@store";
import { trpc } from "@utils/trpc";

export const AppHeader = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const { mutateAsync: pauseTorrent } =
    trpc.controllarr.pauseTorrent.useMutation();

  const { mutateAsync: resumeTorrent } =
    trpc.controllarr.resumeTorrent.useMutation();

  const handleRefreshTorrents = async () => {
    const res = await getAllTorrents();

    dispatch(setTorrents(res));
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 8,
      }}
    >
      <ButtonBase
        icon="play-arrow"
        onPress={async () => {
          const res = await resumeTorrent();

          if (res === "success") {
            await handleRefreshTorrents();
          }
        }}
        style={{ marginRight: 8 }}
        title="Resume All"
      />
      <ButtonBase
        icon="pause"
        onLongPress={() => {
          console.log("Will be automatically pausing all new torrents.");
        }}
        onPress={async () => {
          const res = await pauseTorrent();

          if (res === "success") {
            await handleRefreshTorrents();
          }
        }}
        style={{ marginRight: 8 }}
        title="Pause All"
      />
      <ButtonBase icon="delete" title="Delete All" />
    </View>
  );
};
