-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SOL', 'BTC', 'ETH', 'NFT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CLOSED', 'OPEN', 'DRAFT', 'FAILED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "currentAmount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "projectStatus" "ProjectStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "tokenType" "TokenType" NOT NULL DEFAULT 'SOL',
    "message" TEXT NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "contributorId" INTEGER NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socials" (
    "id" SERIAL NOT NULL,
    "website" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Socials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_projectId_key" ON "Contribution"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_contributorId_key" ON "Contribution"("contributorId");

-- CreateIndex
CREATE UNIQUE INDEX "Socials_projectId_key" ON "Socials"("projectId");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socials" ADD CONSTRAINT "Socials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
