import "module-alias";

import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { exit } from "process";

import { appRouter, createContext } from "./trpc";

export type { Event, Location } from "@prisma/client";
export { AppRouter } from "./trpc/rootRouter";
export * from "./types";

const NODE_ENV = process.env.NODE_ENV;
const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({ message: "OK, B" });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

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
