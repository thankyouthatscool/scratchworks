import { TORRENT_DATA_REQUEST_FIELDS } from "./constants";
import { ConnectionSettings, Torrent, TorrentDataField } from "./types";
import {
  getSessionId,
  performRequest,
  startTorrent,
  stopTorrent,
} from "./functions";

type GetTorrentDataProps = {
  ids?: string[];
  fields?: TorrentDataField[];
  format?: "objects" | "table";
};

export const transmissionRPC = (connectionSettings: ConnectionSettings) => {
  return {
    getSessionIds: async () => getSessionId(connectionSettings),
    getTorrentData: async (props?: GetTorrentDataProps) => {
      const sessionId = await getSessionId(connectionSettings);

      const res = await performRequest({
        connectionSettings,
        method: "torrent-get",
        methodArguments: {
          ids: !!props?.ids?.length ? props.ids : undefined,
          fields: props?.fields || TORRENT_DATA_REQUEST_FIELDS,
          format: props?.format,
        },
        sessionId,
      });

      const torrentList: {
        arguments: { torrents: Torrent[] };
        result: string;
      } = JSON.parse(res);

      return {
        result: torrentList.result,
        torrents: torrentList.arguments.torrents,
      };
    },
    // Torrent Actions
    startTorrent: (ids?: string[]) => startTorrent(connectionSettings, ids),
    stopTorrent: (ids?: string[]) => stopTorrent(connectionSettings, ids),
  };
};

(() => {
  const { getTorrentData, startTorrent, stopTorrent } = transmissionRPC({
    hostname: "192.168.0.40",
    path: "/transmission/rpc",
    port: 9091,
    protocol: "http:",
  });

  (async () => {
    const { result, torrents } = await getTorrentData({
      ids: [],
      fields: ["hashString"],
      format: "objects",
    });

    console.log(torrents, result);

    const resss = await stopTorrent();

    console.log(resss);
  })();
})();
