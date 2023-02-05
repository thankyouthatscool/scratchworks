import { z } from "zod";

import { publicProcedure, router } from ".";
import { prisma } from "../db";
import { parseExcelFile } from "../utils";
import { WarehouseStorageLocation } from "types";

interface WarehouseStorageLocationExt extends WarehouseStorageLocation {
  Colourway?: string;
}

// Location Data
const getAllLocations = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    const fileContent = parseExcelFile();

    const z = fileContent.reduce((acc, val) => {
      const { Colourway, Description, ...rest } =
        val as WarehouseStorageLocationExt;

      const concatenatedDescriptionString = [Description, Colourway]
        .join(" ")
        .trim();

      const newVal = {
        ...rest,
        Description: concatenatedDescriptionString.length
          ? concatenatedDescriptionString
          : undefined,
      };

      if (!acc[val.Location]) {
        return { ...acc, [val.Location]: [newVal] };
      } else {
        return { ...acc, [val.Location]: [...acc[val.Location], newVal] };
      }
    }, {} as { [key: string]: WarehouseStorageLocation[] });

    return z;
  });

// Location Events
const addLocationEventInput = z.object({
  target: z.string(),
  type: z.enum(["locationUpdate"]),
  description: z.string(),
});

const addLocationEvent = publicProcedure
  .input(addLocationEventInput)
  .mutation(async ({ input }) => {
    const { description, target, type } = input;

    try {
      await prisma.event.create({
        data: { description, target, type },
      });

      return { status: "OK" };
    } catch {
      return { status: "FAIL" };
    }
  });

const getLocationEventHistory = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    try {
      const res = await prisma.event.findMany({ where: { target: input } });

      return { events: res, status: "OK" };
    } catch {
      return { events: [], status: "FAIL" };
    }
  });

export const warehouseStorageRouter = router({
  // Events
  addLocationEvent,
  getLocationEventHistory,

  // Location Information
  getAllLocations,
});
