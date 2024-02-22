/*
  Warnings:

  - You are about to drop the column `destinationCode` on the `Ship` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPositionX" REAL NOT NULL,
    "currentPositionY" REAL NOT NULL,
    "destinationPositionX" REAL,
    "destinationPositionY" REAL
);
INSERT INTO "new_Ship" ("currentPositionX", "currentPositionY", "id", "name") SELECT "currentPositionX", "currentPositionY", "id", "name" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
