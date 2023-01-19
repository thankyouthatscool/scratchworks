import { ButtonBase } from "@scratchworks/comp-lib";
import { View } from "react-native";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTorrents } from "@store";
import { trpc } from "@utils/trpc";

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
        flexDirection: "row",
        marginHorizontal: 8,
        marginTop: 8,
      }}
    >
      <ButtonBase
        disabled={!torrents.length}
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
        disabled={!torrents.length}
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
      <ButtonBase
        disabled={!torrents.length}
        icon="delete"
        onPress={async () => {
          console.log("Deleting all torrents");

          const deleteAllTorrentsRes = await deleteTorrent();

          if (deleteAllTorrentsRes === "success") {
            await handleRefreshTorrents();
          }
        }}
        title="Delete All"
      />
    </View>
  );
};
