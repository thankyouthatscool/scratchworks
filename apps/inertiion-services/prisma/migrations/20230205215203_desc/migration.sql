/*
  Warnings:

  - Added the required column `description` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "cartons" DROP NOT NULL,
ALTER COLUMN "piecesPer" DROP NOT NULL,
ALTER COLUMN "piecesTotal" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;
