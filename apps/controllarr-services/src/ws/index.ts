import type { IncomingMessage } from "http";
import url from "url";
import { RawData, Server, WebSocket } from "ws";

import { ee } from "./events";
import { WebSocketExt } from "../../types";

export * from "./events";

export const handleWs = (ws: WebSocket, req: IncomingMessage, wss: Server) => {
  const client = ws as unknown as WebSocketExt;

  const { query } = url.parse(req.url!, true);

  // Let the client set the id.
  //   console.log(query["id"]);

  client.id = `${Date.now()}-mazda`;

  console.log(`Client ${client.id} connected...`);

  client.on("message", (data) => handleMessage(data, client, wss));

  client.on("close", () => {
    console.log(`Client ${client.id} disconnected...`);

    ee.emit("clearClientTimer", client);
  });
};

const handleMessage = (data: RawData, client: WebSocketExt, server: Server) => {
  const { command } = JSON.parse(data.toString()) as {
    command: "subscribe" | "unsubscribe" | "stop";
  };

  if (command === "subscribe") {
    return ee.emit("subscribeClient", client, server);
  }

  if (command === "unsubscribe") {
    return ee.emit("unsubscribeClient", client, server);
  }

  if (command === "stop") {
    return ee.emit("stopTorrentData");
  }

  return;
};
