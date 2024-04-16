/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash]` on the table `Contribution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionHash` to the `Contribution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "transactionHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_transactionHash_key" ON "Contribution"("transactionHash");
