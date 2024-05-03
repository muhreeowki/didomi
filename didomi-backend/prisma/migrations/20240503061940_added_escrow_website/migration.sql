/*
  Warnings:

  - You are about to drop the column `youtubeURL` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Socials` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[escrowAddress]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `escrowAddress` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageURL` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Socials" DROP CONSTRAINT "Socials_projectAddress_fkey";

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "youtubeURL",
ADD COLUMN     "escrowAddress" TEXT NOT NULL,
ADD COLUMN     "websiteURL" TEXT,
ALTER COLUMN "imageURL" SET NOT NULL;

-- DropTable
DROP TABLE "Socials";

-- CreateIndex
CREATE UNIQUE INDEX "Project_escrowAddress_key" ON "Project"("escrowAddress");
