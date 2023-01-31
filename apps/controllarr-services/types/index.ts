import { WebSocket } from "ws";

export interface WebSocketExt extends WebSocket {
  id: string;
}
