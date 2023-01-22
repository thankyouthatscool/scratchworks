import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Torrent } from "@scratchworks/scratchworks-services";

const TORRENT_DATA_KEY = "TORRENT_DATA";

export const getLocalTorrentData = async () => {
  const localTorrentDataString = await AsyncStorage.getItem(TORRENT_DATA_KEY);

  if (!!localTorrentDataString) {
    const localTorrentData: Torrent[] = JSON.parse(localTorrentDataString);

    return localTorrentData;
  } else {
    return [];
  }
};

export const setLocalTorrentData = async (torrentData: Torrent[]) =>
  await AsyncStorage.setItem(TORRENT_DATA_KEY, JSON.stringify(torrentData));
