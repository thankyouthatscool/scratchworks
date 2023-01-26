import http from "node:http";
import https from "node:https";

import { ConnectionSettings } from "../types";

const protocols = { http, https };

export const performRequest = async ({
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
