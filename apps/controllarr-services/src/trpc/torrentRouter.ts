import { z } from "zod";

import { publicProcedure, router } from ".";

const torrentTest = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    return "OK";
  });

export const torrentRouter = router({ torrentTest });
