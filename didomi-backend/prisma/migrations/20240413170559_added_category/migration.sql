/*
  Warnings:

  - Added the required column `category` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EDUCATION', 'MEDICAL', 'MEMORIOAL', 'FAITH', 'EMERGENCY', 'NONPROFIT', 'ENVIRONMENT', 'COMMUNITY', 'CREATIVE', 'EVENT');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" "Category" NOT NULL;
