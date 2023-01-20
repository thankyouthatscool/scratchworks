import http from "http";
import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { publicProcedure, router } from "./index";
import type { Torrent } from "../types";

const getSessionId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];

    const req = http.request(
      {
        hostname: "192.168.0.40",
        protocol: "http:",
        port: 9091,
        path: "/transmission/rpc",
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

const performRequest = async ({
  method,
  methodArguments,
  sessionId,
}: {
  method: any;
  methodArguments?: any;
  sessionId: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data: any[] = [];

    const req = http.request(
      {
        hostname: "192.168.0.40",
        protocol: "http:",
        port: 9091,
        path: "/transmission/rpc",
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

const getAllTorrents = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    try {
      const sessionId = await getSessionId();

      const res = await performRequest({
        method: "torrent-get",
        methodArguments: {
          fields: [
            "hashString",
            "id",
            "name",
            "percentDone",
            "rateDownload",
            "status",
            "totalSize",
          ],
        },
        sessionId,
      });

      const torrentData: {
        arguments: {
          torrents: Torrent[];
        };
        result: string;
      } = JSON.parse(res);

      return torrentData.arguments.torrents;
    } catch (err) {
      return [];
    }
  });

const pauseTorrent = publicProcedure
  .input(z.string().array().optional())
  .mutation(async ({ input }) => {
    const sessionId = await getSessionId();

    const option = !input
      ? { method: "torrent-stop", sessionId }
      : { method: "torrent-stop", methodArguments: { ids: input }, sessionId };

    const res = await performRequest(option);

    const parsedResult: { result: string } = JSON.parse(res);

    return parsedResult.result;
  });

const resumeTorrent = publicProcedure
  .input(z.string().array().optional())
  .mutation(async ({ input }) => {
    const sessionId = await getSessionId();

    const option = !input
      ? { method: "torrent-start", sessionId }
      : { method: "torrent-start", methodArguments: { ids: input }, sessionId };

    const res = await performRequest(option);

    const parsedResult: { result: string } = JSON.parse(res);

    return parsedResult.result;
  });

const deleteTorrent = publicProcedure
  .input(z.string().array().optional())
  .mutation(async ({ input }) => {
    const sessionId = await getSessionId();

    const options = {
      method: "torrent-remove",
      sessionId,
      ...(!!input && { methodArguments: { ids: input } }),
    };

    const res = await performRequest(options);

    const parsedResult: { result: string } = JSON.parse(res);

    return parsedResult.result;
  });

const cleanDownloadsDir = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const DOWNLOADS = path.join(process.env.PWD!, process.env.DOWNLOADS_DIR!);

    const files = await readdir(DOWNLOADS);

    if (existsSync(DOWNLOADS)) {
      await Promise.all(
        files.map(
          async (file) =>
            await rm(path.join(DOWNLOADS, file), {
              force: true,
              recursive: true,
            })
        )
      );
    }

    return "success";
  });

export const controllarrRouter = router({
  getAllTorrents,
  pauseTorrent,
  resumeTorrent,
  deleteTorrent,
  cleanDownloadsDir,
});

export const inertiionRouter = router({
  test: publicProcedure.input(z.string().optional()).mutation(async () => {
    return "Also OK";
  }),
});

export const appRouter = router({
  controllarr: controllarrRouter,
  inertiion: inertiionRouter,
});

export type AppRouter = typeof appRouter;
