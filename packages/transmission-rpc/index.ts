import http from "node:http";
import https from "node:https";

import { ConnectionSettings, Torrent } from "./types";

const protocols = { http, https };

const performRequest = async ({
  connectionSettings: { hostname, path, port, protocol },
  method,
  methodArguments,
  sessionId,
}: {
  connectionSettings: ConnectionSettings;
  method: any;
  methodArguments?: any;
  sessionId: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];

    const req = protocols.http.request(
      {
        hostname,
        protocol,
        port,
        path,
        method: "POST",
        headers: { "x-transmission-session-id": sessionId },
      },
      (res) => {
        res
          .on("data", (chunk) => {
            data.push(chunk);
          })
          .on("end", () => {
            if (res.statusCode === 200) {
              const responseDataString = Buffer.concat(data).toString();

              resolve(responseDataString);
            } else {
              reject(new Error(`HTTP request error: ${res.statusCode}`));
            }
          });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(JSON.stringify({ method, arguments: methodArguments }));
    req.end();
  });
};

const getSessionId = async ({
  hostname,
  path,
  port,
  protocol,
}: ConnectionSettings): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];

    const req = protocols.http.request(
      {
        hostname,
        protocol,
        port,
        path,
        method: "POST",
      },
      (res) => {
        res
          .on("data", (chunk) => {
            data.push(chunk);
          })
          .on("end", () => {
            if (res.statusCode === 200 || res.statusCode === 409) {
              const sessionId = res.headers[
                "x-transmission-session-id"
              ] as string;

              resolve(sessionId);
            } else {
              reject(new Error(`HTTP request error: ${res.statusCode}`));
            }
          });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(JSON.stringify({}));
    req.end();
  });
};

export const transmissionRPC = (connectionSettings: ConnectionSettings) => {
  const ALL_FIELDS = [
    "activityDate",
    "addedDate",
    "availability",
    "bandwidthPriority",
    "comment",
    "corruptEver",
    "creator",
    "dateCreated",
    "desiredAvailable",
    "doneDate",
    "downloadDir",
    "downloadedEver",
    "downloadLimit",
    "downloadLimited",
    "editDate",
    "error",
    "errorString",
    "eta",
    "etaIdle",
    "file-count",
    "files",
    "fileStats",
    "group",
    "hashString",
    "haveUnchecked",
    "haveValid",
    "honorsSessionLimits",
    "id",
    "isFinished",
    "isPrivate",
    "isStalled",
    "labels",
    "leftUntilDone",
    "magnetLink",
    "manualAnnounceTime",
    "maxConnectedPeers",
    "metadataPercentComplete",
    "name",
    "peer-limit",
    "peers",
    "peersConnected",
    "peersFrom",
    "peersGettingFromUs",
    "peersSendingToUs",
    "percentComplete",
    "percentDone",
    "pieces",
    "pieceCount",
    "pieceSize",
    "priorities",
    "primary-mime-type",
    "queuePosition",
    "rateDownload",
    "rateUpload",
    "recheckProgress",
    "secondsDownloading",
    "secondsSeeding",
    "seedIdleLimit",
    "seedIdleMode",
    "seedRatioLimit",
    "seedRatioMode",
    "sizeWhenDone",
    "startDate",
    "status",
    "trackers",
    "trackerList",
    "trackerStats",
    "totalSize",
    "torrentFile",
    "uploadedEver",
    "uploadLimit",
    "uploadLimited",
    "uploadRatio",
    "wanted",
    "webseeds",
    "webseedsSendingToUs",
  ] as const;

  type FIELD = typeof ALL_FIELDS[number];

  return {
    getSessionIds: async () => getSessionId(connectionSettings),
    getTorrentData: async (fields?: FIELD[]) => {
      const sessionId = await getSessionId(connectionSettings);

      const res = await performRequest({
        connectionSettings,
        method: "torrent-get",
        methodArguments: {
          fields: fields || ALL_FIELDS,
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
  };
};

(() => {
  const { getTorrentData } = transmissionRPC({
    hostname: "192.168.0.40",
    path: "/transmission/rpc",
    port: 9091,
    protocol: "http:",
  });

  (async () => {
    const { torrents } = await getTorrentData();

    console.log(torrents[0]?.trackerStats[0]);
  })();
})();
