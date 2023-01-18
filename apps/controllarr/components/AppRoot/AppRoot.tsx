import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/AppHeader";
import { TorrentCard } from "@components/TorrentCard";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setInitializationState, setTorrents } from "@store";
import { trpc } from "@utils/trpc";

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const { isInitializationComplete, torrents } = useAppSelector(
    ({ app }) => app
  );

  const { mutateAsync: getAllTorrents } =
    trpc.controllarr.getAllTorrents.useMutation();

  const handleInitialLoad = async () => {
    try {
      const res = await getAllTorrents();

      dispatch(setTorrents(res));
    } catch {
      dispatch(setTorrents([]));
    }
  };

  useEffect(() => {
    if (!isInitializationComplete) {
      handleInitialLoad();

      const refresh = setInterval(handleInitialLoad, 10000);

      return () => {
        clearInterval(refresh);
      };
    }

    dispatch(setInitializationState(true));
  }, [isInitializationComplete]);

  return (
    <SafeAreaView>
      <AppHeader />
      <View style={{ margin: 8 }}>
        {torrents.map((torrent) => {
          return <TorrentCard key={torrent.hashString} torrentData={torrent} />;
        })}
      </View>
    </SafeAreaView>
  );
};
