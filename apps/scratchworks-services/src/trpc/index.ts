import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import http from "http";
import { z } from "zod";

import type { Torrent } from "../types";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export type AppRouter = typeof appRouter;

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

export const controllarrRouter = router({
  getAllTorrents,
  pauseTorrent,
  resumeTorrent,
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
