/*
  Warnings:

  - You are about to drop the column `accountAddress` on the `Donation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Donation_accountAddress_key";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "accountAddress";
