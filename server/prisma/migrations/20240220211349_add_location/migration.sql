/*
  Warnings:

  - Made the column `name` on table `Ship` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPositionX" REAL NOT NULL,
    "currentPositionY" REAL NOT NULL
);
INSERT INTO "new_Ship" ("currentPositionX", "currentPositionY", "id", "name") SELECT "currentPositionX", "currentPositionY", "id", "name" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
