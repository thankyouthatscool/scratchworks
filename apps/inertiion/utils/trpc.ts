import type { AppRouter } from "@scratchworks/inertiion-services";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
