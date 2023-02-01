import flatten from "lodash.flattendeep";
import { resolve } from "path";
import { readFile, utils } from "xlsx";

import { WarehouseStorageLocation } from "../types";

export const parseExcelFile = () => {
  const fileData = readFile(resolve(__dirname, "../../data/Book1.xlsx"));

  const sheets = fileData.SheetNames;

  const res = sheets.map((sheet) => {
    const data = utils.sheet_to_json(
      fileData.Sheets[sheet]
    ) as WarehouseStorageLocation[];

    return data;
  });

  return flatten(res);
};
