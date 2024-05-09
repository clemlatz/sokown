/*
  Warnings:

  - You are about to drop the column `currentOrientation` on the `Ship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ship` DROP COLUMN `currentOrientation`,
    ADD COLUMN `currentCourse` DOUBLE NOT NULL DEFAULT 0;
