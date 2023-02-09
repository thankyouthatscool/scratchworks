import { z } from "zod";

import { publicProcedure, router } from ".";
import { prisma } from "../db";
import { parseExcelFile } from "../utils";

const warehouseStorageItemInput = z.object({
  id: z.string().optional(),
  locationName: z.string(),
  description: z.string(),
  cartons: z.number().optional(),
  piecesPer: z.number().optional(),
  piecesTotal: z.number().optional(),
  date: z.string().optional(),
  initials: z.string(),
});

// Items
const addWarehouseStorageItem = publicProcedure
  .input(warehouseStorageItemInput)
  .mutation(async ({ input }) => {
    try {
      const res = await prisma.location.create({
        data: {
          ...input,
          date: !!input.date ? new Date(input.date) : new Date(),
        },
        include: { events: true },
      });

      return { newLocation: res, status: "OK" };
    } catch {
      return { newLocation: null, status: "FAIL" };
    }
  });

const editWarehouseStorageItem = publicProcedure
  .input(warehouseStorageItemInput)
  .mutation(async ({ input }) => {
    const { id, ...data } = input;

    try {
      const res = await prisma.location.update({
        where: { id },
        data: { ...data, date: data.date ? new Date(data.date) : new Date() },
        include: { events: true },
      });

      return { status: "OK", updateRes: res };
    } catch (e) {
      console.log(e);

      return { status: "FAIL", updateRes: null };
    }
  });

const deleteWarehouseStorageItem = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    try {
      await prisma.location.delete({
        where: { id: input },
      });

      return { status: "OK" };
    } catch {
      return { status: "FAIL" };
    }
  });

// Locations
const getAllLocations = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    try {
      const res = await prisma.location.findMany({ include: { events: true } });

      return { locations: res, status: "OK" };
    } catch {
      return { locations: [], status: "FAIL" };
    }
  });

const cleanDatabase = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    try {
      await prisma.location.deleteMany();

      return { status: "OK" };
    } catch {
      return { status: "FAIL" };
    }
  });

const parseSpreadsheet = publicProcedure
  .input(z.string().optional())
  .mutation(async () => {
    try {
      const fileContent = parseExcelFile();

      const mappedFileContent = fileContent.map((loc) => {
        const { Description, Colourway } = loc;

        const concatenatedDescriptionString = [Description, Colourway]
          .join(" ")
          .trim();

        const dateParts = loc.Date?.split("/");

        return {
          ...(!!dateParts && {
            date: new Date(`${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`),
          }),
          description: concatenatedDescriptionString,
          ...(!!loc.Cartons && { cartons: loc.Cartons }),
          ...(!!loc.Pieces && { piecesTotal: loc.Pieces }),
          piecesPer: null,
          locationName: loc.Location,
          initials: loc.Initials || "N/A",
        };
      });

      await prisma.location.createMany({ data: mappedFileContent });

      return { status: "OK" };
    } catch {
      return { status: "FAIL" };
    }
  });

// Location Events
const addLocationEventInput = z.object({
  target: z.string(),
  type: z.enum(["locationUpdate"]),
  description: z.string(),
});

// const addLocationEvent = publicProcedure
//   .input(addLocationEventInput)
//   .mutation(async ({ input }) => {
//     const { description, target, type } = input;

//     try {
//       await prisma.event.create({
//         data: { description, target, type },
//       });

//       return { status: "OK" };
//     } catch {
//       return { status: "FAIL" };
//     }
//   });

// const getLocationEventHistory = publicProcedure
//   .input(z.string())
//   .mutation(async ({ input }) => {
//     try {
//       const res = await prisma.event.findMany({ where: { target: input } });

//       return { events: res, status: "OK" };
//     } catch {
//       return { events: [], status: "FAIL" };
//     }
//   });

export const warehouseStorageRouter = router({
  // Events
  // addLocationEvent,
  // getLocationEventHistory,

  // Items
  addWarehouseStorageItem,
  editWarehouseStorageItem,
  deleteWarehouseStorageItem,

  // Locations
  cleanDatabase,
  getAllLocations,
  parseSpreadsheet,
});

// (async () => {
//   const fileContent = parseExcelFile();

//   const mappedFileContent = fileContent.map((loc) => {
//     const { Description, Colourway } = loc;

//     const concatenatedDescriptionString = [Description, Colourway]
//       .join(" ")
//       .trim();

//     const dateParts = loc.Date?.split("/");

//     return {
//       ...(!!dateParts && {
//         date: new Date(`${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`),
//       }),
//       description: concatenatedDescriptionString,
//       ...(!!loc.Cartons && { cartons: loc.Cartons }),
//       ...(!!loc.Pieces && { piecesTotal: loc.Pieces }),
//       piecesPer: null,
//       locationName: loc.Location,
//       initials: loc.Initials || "N/A",
//     };
//   });

//   console.log(mappedFileContent);

//   await prisma.location.createMany({ data: mappedFileContent });
// })();
