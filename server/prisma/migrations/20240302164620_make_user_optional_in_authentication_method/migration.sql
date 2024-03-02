-- DropForeignKey
ALTER TABLE `AuthenticationMethod` DROP FOREIGN KEY `AuthenticationMethod_userId_fkey`;

-- AlterTable
ALTER TABLE `AuthenticationMethod` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AuthenticationMethod` ADD CONSTRAINT `AuthenticationMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
