-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPositionX" REAL NOT NULL,
    "currentPositionY" REAL NOT NULL,
    "destinationId" INTEGER,
    CONSTRAINT "Ship_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ship" ("currentPositionX", "currentPositionY", "id", "name") SELECT "currentPositionX", "currentPositionY", "id", "name" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;