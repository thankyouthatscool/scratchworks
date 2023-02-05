-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('locationUpdate');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "type" "EventType" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
