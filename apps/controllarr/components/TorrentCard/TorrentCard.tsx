import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Torrent } from "@scratchworks/scratchworks-services";
import { FC, ComponentPropsWithoutRef } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppDispatch } from "@hooks";
import { setTorrents } from "@store";
import { trpc } from "@utils/trpc";

const torrentStateLookup = (stateCode: number) => {
  switch (stateCode) {
    case 0:
      return "stopped";
    case 1:
      return "queued_verify";
    case 2:
      return "verifying";
    case 3:
      return "queued";
    case 4:
      return "downloading";
    case 5:
      return "queued_seed";
    case 6:
      return "seeding";
    default:
      return "other";
  }
};

type TorrentCardProps = {
  torrentData: Torrent;
};

export const TorrentCard: FC<
  TorrentCardProps & ComponentPropsWithoutRef<typeof Pressable>
> = ({ torrentData }) => {
  const dispatch = useAppDispatch();

  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const { mutateAsync: deleteTorrent } =
    trpc.controllarr.deleteTorrent.useMutation();

  const handleRefreshTorrents = async () => {
    const res = await getAllTorrents();

    dispatch(setTorrents(res));
  };

  return (
    <Pressable
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        elevation: 5,
        padding: 8,
        marginBottom: 8,
      }}
    >
      <Text>{torrentData.name}</Text>
      <Text>{torrentData.totalSize}</Text>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            console.log("res");
          }}
        >
          <MaterialIcons
            name={
              torrentStateLookup(torrentData.status) === "downloading" ||
              torrentStateLookup(torrentData.status) === "seeding"
                ? "pause"
                : "play-arrow"
            }
            size={30}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar
            progress={torrentData.percentDone * 100}
            rateDownload={torrentData.rateDownload}
            status={torrentStateLookup(torrentData.status)}
          />
        </View>
        <Pressable
          onPress={async () => {
            const deleteTorrentRes = await deleteTorrent([
              torrentData.hashString,
            ]);

            if (deleteTorrentRes === "success") {
              await handleRefreshTorrents();
            }
          }}
        >
          <MaterialIcons color="red" name="delete" size={30} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const ProgressBar = ({
  progress,
  rateDownload,
  status,
}: {
  progress: number;
  rateDownload: number;
  status?:
    | "downloading"
    | "other"
    | "queued"
    | "queued_seed"
    | "queued_verify"
    | "seeding"
    | "stopped"
    | "verifying";
}) => {
  return (
    <View
      style={{
        backgroundColor:
          status === "downloading"
            ? "green"
            : status === "seeding"
            ? "blue"
            : status === "stopped"
            ? "grey"
            : "orange",
        borderRadius: 5,
        height: 20,
        justifyContent: "center",
        width: `${progress}%`,
      }}
    >
      <Text style={{ color: "white", fontSize: 12, marginLeft: 9 }}>
        {progress}% @ {rateDownload}
      </Text>
    </View>
  );
};
