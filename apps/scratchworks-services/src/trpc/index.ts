import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export type AppRouter = typeof appRouter;

const test = publicProcedure.input(z.string().optional()).mutation(async () => {
  return "OK";
});

export const controllarrRouter = router({
  test,
});

export const inertiionRouter = router({
  test: publicProcedure.input(z.string().optional()).mutation(async () => {
    return "ALSO OK";
  }),
});

export const appRouter = router({
  controllarr: controllarrRouter,
  inertiion: inertiionRouter,
});
