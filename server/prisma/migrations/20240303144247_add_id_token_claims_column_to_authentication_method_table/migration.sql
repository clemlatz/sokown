/*
  Warnings:

  - You are about to drop the column `idToken` on the `AuthenticationMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AuthenticationMethod` DROP COLUMN `idToken`,
    ADD COLUMN `idTokenClaims` JSON NULL;
