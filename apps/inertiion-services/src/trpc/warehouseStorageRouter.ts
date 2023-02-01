import { z } from "zod";

import { publicProcedure, router } from ".";
import { parseExcelFile } from "@utils";
import { WarehouseStorageLocation } from "types";

const getAllLocations = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const fileContent = parseExcelFile();

    const z = fileContent.reduce((acc, val) => {
      if (!acc[val.Location]) {
        return { ...acc, [val.Location]: [val] };
      } else {
        return { ...acc, [val.Location]: [...acc[val.Location], val] };
      }
    }, {} as { [key: string]: WarehouseStorageLocation[] });

    return z;
  });

export const warehouseStorageRouter = router({ getAllLocations });
