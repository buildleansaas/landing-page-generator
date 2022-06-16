/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId",
ADD COLUMN     "stripeLiveCustomerId" TEXT,
ADD COLUMN     "stripeTestCustomerId" TEXT;