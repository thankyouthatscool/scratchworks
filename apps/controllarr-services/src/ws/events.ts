import { EventEmitter } from "events";
import { Server } from "ws";

import { WebSocketExt } from "../../types";

export const ee = new EventEmitter();

let timers: { [key: string]: NodeJS.Timer } = {};
let torrentTimer: NodeJS.Timer;

ee.on("subscribeClient", (ws: WebSocketExt, server: Server) => {
  ws.send(
    JSON.stringify({
      data: "new torrent data go here",
      time: new Date(Date.now()).toUTCString(),
      clients: server.clients.size,
      timers: Object.keys(timers).length,
    })
  );

  const timer = setInterval(() => {
    ws.send(
      JSON.stringify({
        data: "new torrent data go here",
        time: new Date(Date.now()).toUTCString(),
        clients: server.clients.size,
        timers: Object.keys(timers).length,
      })
    );
  }, 5000);

  timers = { ...timers, [ws.id]: timer };
});

ee.on("unsubscribeClient", (ws: WebSocketExt, server: Server) => {
  const { [ws.id]: targetTimer, ...rest } = timers;

  timers = rest;

  clearInterval(targetTimer);

  ws.send(
    JSON.stringify({
      message: "unsubscribed",
      timers: Object.keys(timers).length,
      clients: server.clients.size,
    })
  );
});

ee.on("clearClientTimer", (ws: WebSocketExt) => {
  const { [ws.id]: targetTimer, ...rest } = timers;

  timers = rest;

  clearInterval(targetTimer);
});

ee.on("getTorrentData", () => {
  torrentTimer = setInterval(() => {
    console.log("getting torrent data");
  }, 5000);
});

ee.on("stopTorrentData", () => {
  clearInterval(torrentTimer);
});
