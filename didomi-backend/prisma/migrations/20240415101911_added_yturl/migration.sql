/*
  Warnings:

  - You are about to drop the column `mediaUrls` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "mediaUrls",
DROP COLUMN "name",
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "youtubeURL" TEXT,
ALTER COLUMN "endDate" DROP NOT NULL;
