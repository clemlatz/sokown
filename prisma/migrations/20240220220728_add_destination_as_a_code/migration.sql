/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `destinationId` on the `Ship` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Location";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPositionX" REAL NOT NULL,
    "currentPositionY" REAL NOT NULL,
    "destinationCode" TEXT
);
INSERT INTO "new_Ship" ("currentPositionX", "currentPositionY", "id", "name") SELECT "currentPositionX", "currentPositionY", "id", "name" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
