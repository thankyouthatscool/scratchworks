import type { Torrent } from "@scratchworks/scratchworks-services";
import * as Haptics from "expo-haptics";
import React, {
  FC,
  ComponentPropsWithoutRef,
  useState,
  useEffect,
  useRef,
} from "react";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  HandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
  LongPressGestureHandler,
  LongPressGestureHandlerEventPayload,
} from "react-native-gesture-handler";

import { useAppDispatch, useToast } from "@hooks";
import { setTorrents } from "@store";
import {
  PROGRESS_BAR_BACKGROUND_DOWNLOADING,
  PROGRESS_BAR_BACKGROUND_OTHER,
  PROGRESS_BAR_BACKGROUND_SEEDING,
  PROGRESS_BAR_BACKGROUND_STOPPED,
  PROGRESS_BAR_BORDER,
} from "@theme";
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
  // Hooks
  const dispatch = useAppDispatch();

  const { showToast } = useToast();

  // State
  const [historicTorrentData, setHistoricTorrentData] = useState<Torrent[]>([]);
  const [isBlockingOperationInProgress, setIsBlockingOperationInProgress] =
    useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<string | null>(null);

  // trpc
  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const { mutateAsync: pauseTorrent } =
    trpc.controllarr.pauseTorrent.useMutation();

  const { mutateAsync: resumeTorrent } =
    trpc.controllarr.resumeTorrent.useMutation();

  const { mutateAsync: deleteTorrent } =
    trpc.controllarr.deleteTorrent.useMutation();

  // Handlers
  const handleRefreshTorrents = async () => {
    const res = await getAllTorrents();

    dispatch(setTorrents(res));
  };

  const doubleTapRef = useRef(null);

  const onSingleTapEvent = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("single tap");
    }
  };

  const onDoubleTapEvent = async (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (torrentData.status === 4) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
          const res = await pauseTorrent([torrentData.hashString]);

          if (res === "success") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            return showToast({
              message: `${torrentData.name} download stopped`,
            });
          } else {
            return showToast({
              message: `Failed to stop ${torrentData.name}`,
            });
          }
        } catch {
          return showToast({ message: "GENERIC_ERROR_MESSAGE" });
        }
      }

      if (torrentData.status === 6) {
        try {
          const res = await pauseTorrent([torrentData.hashString]);

          if (res === "success") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            showToast({ message: `${torrentData.name} upload stopped` });
          } else {
            showToast({ message: `Failed to stop ${torrentData.name}` });
          }
        } catch {
          return showToast({ message: "GENERIC_ERROR_MESSAGE" });
        }
      }

      if (torrentData.status === 0) {
        try {
          const res = await resumeTorrent([torrentData.hashString]);

          if (res === "success") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            return showToast({ message: `${torrentData.name} resumed` });
          } else {
            return showToast({
              message: `Failed to resume ${torrentData.name}`,
            });
          }
        } catch {
          return showToast({ message: "GENERIC_ERROR_MESSAGE" });
        }
      }
    }
  };

  const onLongPress = (
    event: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      setVisibleModal(() => torrentData.hashString);
    }
  };

  // Effects
  useEffect(() => {
    setHistoricTorrentData((htd) => [...htd.slice(-19), torrentData]);
  }, [torrentData]);

  return (
    <LongPressGestureHandler onHandlerStateChange={onLongPress}>
      <TapGestureHandler
        onHandlerStateChange={onSingleTapEvent}
        waitFor={doubleTapRef}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={onDoubleTapEvent}
          ref={doubleTapRef}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: "500" }}>{torrentData.name}</Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              {/* <Pressable
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
                      torrentData.status === 4 || torrentData.status === 6
                        ? -5
                        : -6,
                  }}
                />
              </Pressable> */}
              <View style={{ flex: 1 }}>
                <ProgressBar
                  downloadedEver={torrentData.downloadedEver}
                  progress={torrentData.percentDone * 100}
                  rateDownload={torrentData.rateDownload}
                  status={torrentStateLookup(torrentData.status)}
                  totalSize={torrentData.totalSize}
                />
              </View>
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
                    borderRadius: 5,
                    flex: 1,
                    justifyContent: "center",
                    margin: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderColor: "red",
                      borderWidth: 2,
                      borderRadius: 5,
                      elevation: 10,
                      padding: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16 * 1.5,
                        fontWeight: "500",
                      }}
                    >
                      Deleting
                    </Text>
                    <Text style={{ marginBottom: 8, fontWeight: "500" }}>
                      {torrentData.name}
                    </Text>
                    <ProgressBar
                      downloadedEver={torrentData.downloadedEver}
                      progress={torrentData.percentDone * 100}
                      rateDownload={torrentData.rateDownload}
                      status={torrentStateLookup(torrentData.status)}
                      totalSize={torrentData.totalSize}
                    />
                    {torrentData.status === 4 && (
                      <SpeedChart
                        historicTorrentData={historicTorrentData}
                        rate="download"
                      />
                    )}
                    {torrentData.status === 6 &&
                      !historicTorrentData.every(
                        (torrent) => torrent.rateUpload === 0
                      ) && (
                        <SpeedChart
                          historicTorrentData={historicTorrentData}
                          rate="upload"
                        />
                      )}

                    <View
                      style={{
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        marginTop: 8,
                      }}
                    >
                      <ButtonBase
                        disabled={isBlockingOperationInProgress}
                        onPress={() => {
                          setVisibleModal(() => null);
                        }}
                        style={{ marginRight: 8 }}
                        title="Cancel"
                      />
                      <ButtonBase
                        buttonType="danger"
                        disabled={isBlockingOperationInProgress}
                        onPress={async () => {
                          setIsBlockingOperationInProgress(() => true);

                          try {
                            const res = await deleteTorrent([
                              torrentData.hashString,
                            ]);

                            if (res === "fail") {
                              showToast({
                                message: `${torrentData.name} was not deleted`,
                              });
                            } else {
                              await handleRefreshTorrents();

                              showToast({
                                message: `${torrentData.name} deleted`,
                              });

                              setVisibleModal(() => null);
                            }
                          } catch {
                            showToast({ message: "GENERIC_ERROR_MESSAGE" });
                          }

                          setIsBlockingOperationInProgress(() => false);
                        }}
                        title="Delete"
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            {torrentData.status === 4 && (
              <SpeedChart
                historicTorrentData={historicTorrentData}
                rate="download"
              />
            )}
            {torrentData.status === 6 &&
              !historicTorrentData.every(
                (torrent) => torrent.rateUpload === 0
              ) && (
                <SpeedChart
                  historicTorrentData={historicTorrentData}
                  rate="upload"
                />
              )}
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
    </LongPressGestureHandler>
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
        borderColor: PROGRESS_BAR_BORDER,
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
              ? PROGRESS_BAR_BACKGROUND_DOWNLOADING
              : status === "seeding"
              ? PROGRESS_BAR_BACKGROUND_SEEDING
              : status === "stopped"
              ? PROGRESS_BAR_BACKGROUND_STOPPED
              : PROGRESS_BAR_BACKGROUND_OTHER,
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

type SpeedChartProps = {
  historicTorrentData: Torrent[];
  rate: "download" | "upload";
};

const SpeedChart = ({ historicTorrentData, rate }: SpeedChartProps) => {
  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const data = {
    labels: [],
    datasets: [
      {
        data: !historicTorrentData?.length
          ? [0]
          : historicTorrentData.map((torrent) =>
              rate === "download" ? torrent.rateDownload : torrent.rateUpload
            ),
        color: () =>
          rate === "download"
            ? PROGRESS_BAR_BACKGROUND_DOWNLOADING
            : PROGRESS_BAR_BACKGROUND_SEEDING,
        strokeWidth: 4,
      },
    ],
  };

  return (
    <LineChart
      bezier
      chartConfig={chartConfig}
      data={data}
      height={75}
      width={Dimensions.get("window").width - 32}
      formatYLabel={(value) => formatBytes(parseInt(value)).toString()}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      fromZero={true}
      withDots={false}
      withVerticalLines={false}
      withHorizontalLines={false}
      style={{
        paddingRight: 8,
      }}
    />
  );
};
