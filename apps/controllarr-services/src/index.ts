import "module-alias/register";

import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import expressWs from "express-ws";
import { exit } from "process";

import { appRouter, createContext } from "./trpc";
import { ee, handleWs } from "./ws";

export * from "./trpc";

const NODE_ENV = process.env.NODE_ENV;
const SERVER_PORT = process.env.SERVER_PORT;

const { app, getWss } = expressWs(express());

const wss = getWss();

app.get("/", (_, res) => {
  return res.json({ message: "OK, BROTHER!!!" });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

app.ws("/ws", (ws, req) => handleWs(ws, req, wss));

const startServer = async (port?: number) => {
  const PORT = port || parseInt(SERVER_PORT!);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}...`);
  });
};

export const main = () => {
  if (NODE_ENV === "dev") {
    console.log("Running in dev...");

    try {
      startServer(5000);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Something went horribly wrong.\nExiting.");
      }
      exit(1);
    }
  } else if (NODE_ENV === "prod") {
    console.log("Running in prod...");

    startServer();
  } else {
    console.log("NODE_ENV not set.\nExiting.");

    exit(1);
  }
};

main();
