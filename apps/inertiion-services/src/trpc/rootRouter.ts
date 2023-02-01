import { router } from ".";
import { warehouseStorageRouter } from "./warehouseStorageRouter";

export const appRouter = router({ warehouseStorageRouter });

export type AppRouter = typeof appRouter;
