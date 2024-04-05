/*
  Warnings:

  - You are about to drop the column `contributorId` on the `Contribution` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Socials` table. All the data in the column will be lost.
  - You are about to drop the `Contributor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountAddress]` on the table `Contribution` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountAddress]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectAddress]` on the table `Socials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountAddress` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contributorAddress` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountAddress` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectAddress` to the `Socials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Socials" DROP CONSTRAINT "Socials_projectId_fkey";

-- DropIndex
DROP INDEX "Contribution_contributorId_key";

-- DropIndex
DROP INDEX "Contribution_projectId_key";

-- DropIndex
DROP INDEX "Socials_projectId_key";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "contributorId",
ADD COLUMN     "accountAddress" TEXT NOT NULL,
ADD COLUMN     "contributorAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ownerName",
ADD COLUMN     "accountAddress" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Socials" DROP COLUMN "projectId",
ADD COLUMN     "projectAddress" TEXT NOT NULL;

-- DropTable
DROP TABLE "Contributor";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_accountAddress_key" ON "Contribution"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Project_accountAddress_key" ON "Project"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Socials_projectAddress_key" ON "Socials"("projectAddress");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerAddress_fkey" FOREIGN KEY ("ownerAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_projectAddress_fkey" FOREIGN KEY ("projectAddress") REFERENCES "Project"("accountAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributorAddress_fkey" FOREIGN KEY ("contributorAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socials" ADD CONSTRAINT "Socials_projectAddress_fkey" FOREIGN KEY ("projectAddress") REFERENCES "Project"("accountAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
