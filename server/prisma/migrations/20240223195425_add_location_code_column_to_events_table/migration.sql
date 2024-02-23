/*
  Warnings:

  - Added the required column `locationCode` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipId" INTEGER NOT NULL,
    "locationCode" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "loggedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("id", "loggedAt", "message", "shipId") SELECT "id", "loggedAt", "message", "shipId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
