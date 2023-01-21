import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Torrent } from "@scratchworks/scratchworks-services";
import { FC, ComponentPropsWithoutRef, useState } from "react";
import { Button, Modal, Pressable, Text, View } from "react-native";

import { useAppDispatch, useToast } from "@hooks";
import { setTorrents } from "@store";
import { formatBytes, trpc } from "@utils";
import { ButtonBase } from "@/../../packages/comp-lib";

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

  const { showToast } = useToast();

  const [visibleModal, setVisibleModal] = useState<string | null>(null);

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
    <Pressable
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        padding: 8,
        marginBottom: 8,
      }}
    >
      <Text>{torrentData.name}</Text>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <Pressable
          onPress={async () => {
            if (torrentData.status === 0) {
              try {
                const res = await resumeTorrent([torrentData.hashString]);

                if (res === "fail") {
                  showToast({ message: "Could not resume torrent" });
                } else {
                  showToast({ message: `${torrentData.name} resumed` });
                }
              } catch {
                showToast({ message: "GENERIC_ERROR_MESSAGE" });
              }
            } else {
              try {
                const res = await pauseTorrent([torrentData.hashString]);

                if (res === "fail") {
                  showToast({ message: "Could not pause Torrent" });
                } else {
                  showToast({ message: `${torrentData.name} paused` });
                }
              } catch {
                showToast({ message: "GENERIC_ERROR_MESSAGE" });
              }
            }
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
            style={{
              marginLeft:
                torrentData.status === 4 || torrentData.status === 6 ? -5 : -6,
            }}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar
            downloadedEver={torrentData.downloadedEver}
            progress={torrentData.percentDone * 100}
            rateDownload={torrentData.rateDownload}
            status={torrentStateLookup(torrentData.status)}
            totalSize={torrentData.totalSize}
          />
        </View>
        <Pressable
          onPress={() => {
            setVisibleModal(() => torrentData.hashString);
          }}
        >
          <MaterialIcons color="red" name="delete" size={30} />
          <Modal
            animationType="fade"
            hardwareAccelerated={true}
            onRequestClose={() => {
              setVisibleModal(() => null);
            }}
            transparent={true}
            visible={visibleModal === torrentData.hashString}
          >
            <View
              style={{
                backgroundColor: "white",
                borderColor: "red",
                borderRadius: 5,
                borderWidth: 2,
                elevation: 10,
                margin: 8,
                padding: 8,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "red", fontSize: 16 * 1.5, fontWeight: "500" }}
              >
                Deleting
              </Text>
              <Text style={{ marginBottom: 8 }}>{torrentData.name}</Text>
              <ProgressBar
                downloadedEver={torrentData.downloadedEver}
                progress={torrentData.percentDone * 100}
                rateDownload={torrentData.rateDownload}
                status={torrentStateLookup(torrentData.status)}
                totalSize={torrentData.totalSize}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                }}
              >
                <ButtonBase
                  onPress={() => {
                    setVisibleModal(() => null);
                  }}
                  style={{ marginRight: 8 }}
                  title="Cancel"
                />
                <ButtonBase
                  onPress={async () => {
                    try {
                      const res = await deleteTorrent([torrentData.hashString]);

                      if (res === "fail") {
                        showToast({
                          message: `${torrentData.name} was not deleted`,
                        });

                        setVisibleModal(() => null);
                      } else {
                        showToast({ message: `${torrentData.name} deleted` });
                      }
                    } catch {
                      showToast({ message: "GENERIC_ERROR_MESSAGE" });
                    }
                  }}
                  title="Delete"
                />
              </View>
            </View>
          </Modal>
        </Pressable>
      </View>
    </Pressable>
  );
};

type ProgressBarProps = {
  downloadedEver: number;
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
  totalSize: number;
};

// const ProgressBar = ({
//   progress,
//   rateDownload,
//   status,
// }: {
//   progress: number;
//   rateDownload: number;
//   status?:
//     | "downloading"
//     | "other"
//     | "queued"
//     | "queued_seed"
//     | "queued_verify"
//     | "seeding"
//     | "stopped"
//     | "verifying";
// }) => {
//   return (
//     <View
//       style={{
//         backgroundColor:
//           status === "downloading"
//             ? "green"
//             : status === "seeding"
//             ? "blue"
//             : status === "stopped"
//             ? "grey"
//             : "orange",
//         borderRadius: 5,
//         height: 20,
//         justifyContent: "center",
//         width: `${progress}%`,
//       }}
//     >
//       <Text style={{ color: "white", fontSize: 12, marginLeft: 9 }}>
//         {progress}% @ {rateDownload}
//       </Text>
//     </View>
//   );
// };

const ProgressBar = ({
  downloadedEver,
  progress,
  rateDownload,
  status,
  totalSize,
}: ProgressBarProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 2,
        height: 25,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor:
            status === "downloading"
              ? "green"
              : status === "seeding"
              ? "blue"
              : status === "stopped"
              ? "grey"
              : "orange",
          borderRadius: 3,
          height: "100%",
          position: "absolute",
          width: `${progress}%`,
        }}
      />
      <Text style={{ fontSize: 12 }}>
        {progress >= 100
          ? `${progress.toFixed(2)}%`
          : `${progress.toFixed(2)} % @ ${formatBytes(rateDownload)}`}
        {" | "}
        {progress >= 100
          ? formatBytes(totalSize)
          : `${formatBytes(downloadedEver)}/${formatBytes(totalSize)}`}
      </Text>
    </View>
  );
};
