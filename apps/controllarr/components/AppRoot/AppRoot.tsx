import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { ButtonBase } from "@scratchworks/comp-lib";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/AppHeader";
import { TorrentCard } from "@components/TorrentCard";
import { useAppDispatch, useAppSelector, useToast } from "@hooks";
import {
  setAutoPause,
  setBottomSheetState,
  setInitializationState,
  setTorrents,
} from "@store";
import { trpc } from "@utils/trpc";

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const { showToast } = useToast();

  const {
    isAutoPauseEnabled,
    isBottomSheetOpen,
    isInitializationComplete,
    torrents,
  } = useAppSelector(({ app }) => app);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const { mutateAsync: resumeTorrent } =
    trpc.controllarr.resumeTorrent.useMutation();

  const { mutateAsync: pauseTorrent } =
    trpc.controllarr.pauseTorrent.useMutation();

  const { mutateAsync: cleanDownloadsDir } =
    trpc.controllarr.cleanDownloadsDir.useMutation();

  // Handlers

  const handleInitialLoad = async () => {
    try {
      const res = await getAllTorrents();

      dispatch(setTorrents(res));
    } catch {
      dispatch(setTorrents([]));
    }
  };

  const handlePauseAllTorrents = async () => {
    try {
      const res = await pauseTorrent();

      if (res === "fail") {
        showToast({ message: "Could not auto pause all Torrents" });
      } else {
        showToast({ message: "All Torrents auto paused" });
      }
    } catch {
      showToast({ message: "GENERIC_ERROR_MESSAGE" });
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      dispatch(setBottomSheetState(false));
    }
  }, []);

  // Side Effects

  useEffect(() => {
    if (!isInitializationComplete) {
      handleInitialLoad();

      const refresh = setInterval(handleInitialLoad, 1000);

      return () => {
        clearInterval(refresh);
      };
    }

    dispatch(setInitializationState(true));
  }, [isInitializationComplete]);

  useEffect(() => {
    if (!!isBottomSheetOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isBottomSheetOpen]);

  useEffect(() => {
    if (!!isAutoPauseEnabled) {
      if (!torrents.every((torrent) => torrent.status === 0)) {
        handlePauseAllTorrents();
      }
    }
  }, [isAutoPauseEnabled, torrents]);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#F1F5F9" }}>
      <AppHeader />
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 8 }}
      >
        <View style={{ marginHorizontal: 8 }}>
          {torrents.map((torrent) => {
            return (
              <TorrentCard key={torrent.hashString} torrentData={torrent} />
            );
          })}
        </View>
      </ScrollView>

      <BottomSheet
        contentHeight={animatedContentHeight}
        enablePanDownToClose
        handleHeight={animatedHandleHeight}
        index={-1}
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
      >
        <View
          onLayout={handleContentLayout}
          style={{
            backgroundColor: "#F1F5F9",
            flex: 1,
            padding: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <ButtonBase
                icon="play-arrow"
                onPress={async () => {
                  try {
                    const res = await resumeTorrent();

                    if (res === "fail") {
                      showToast({ message: "Could not resume all Torrents" });
                    } else {
                      showToast({ message: "All Torrents resumed" });

                      dispatch(setAutoPause(false));
                    }
                  } catch {
                    showToast({ message: "GENERIC_ERROR_MESSAGE" });
                  }
                }}
                style={{ marginRight: 8 }}
                title="Resume All"
              />
              <ButtonBase
                icon="pause"
                onPress={async () => {
                  try {
                    const res = await pauseTorrent();

                    if (res === "fail") {
                      showToast({ message: "Could not pause all Torrents" });
                    } else {
                      showToast({ message: "All Torrents paused" });
                    }
                  } catch {
                    showToast({ message: "GENERIC_ERROR_MESSAGE" });
                  }
                }}
                style={{ marginRight: 8 }}
                title="Stop All"
              />
            </View>
            <ButtonBase
              icon="delete"
              onPress={() => {
                console.log("deleting all torrents");
              }}
              title="Delete All"
            />
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 8,
            }}
          >
            <Text>Auto Pause All Torrents</Text>
            <Switch
              onValueChange={(e) => {
                dispatch(setAutoPause(e));
              }}
              value={isAutoPauseEnabled}
            />
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};
