/*
  Warnings:

  - You are about to drop the `Contribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_contributorAddress_fkey";

-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_projectAddress_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "totalDonations" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Contribution";

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tokenType" "TokenType" NOT NULL DEFAULT 'SOL',
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "donorAddress" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_accountAddress_key" ON "Donation"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_transactionHash_key" ON "Donation"("transactionHash");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_projectAddress_fkey" FOREIGN KEY ("projectAddress") REFERENCES "Project"("accountAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorAddress_fkey" FOREIGN KEY ("donorAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
