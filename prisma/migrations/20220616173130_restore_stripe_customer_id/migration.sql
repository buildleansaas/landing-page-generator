/*
  Warnings:

  - You are about to drop the column `stripeLiveCustomerId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeLiveCustomerId",
ADD COLUMN     "stripeCustomerId" TEXT;
