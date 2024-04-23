/*
  Warnings:

  - You are about to drop the column `accepted_coins` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "accepted_coins",
ADD COLUMN     "acceptedCoins" "TokenType"[];
