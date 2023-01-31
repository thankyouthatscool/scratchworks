import { router } from ".";
import { torrentRouter } from "./torrentRouter";

export const appRouter = router({ torrentRouter });

export type appRouter = typeof appRouter;
