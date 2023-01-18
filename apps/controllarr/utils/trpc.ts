import type { AppRouter } from "@scratchworks/scratchworks-services";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
