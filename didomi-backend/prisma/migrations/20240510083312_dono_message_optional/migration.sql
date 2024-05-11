/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "message" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");
