-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SOL', 'USDT', 'USDC', 'LINK', 'RNDR', 'WIF', 'JUP', 'NFT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CLOSED', 'OPEN', 'DRAFT', 'FAILED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "currentAmount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "projectStatus" "ProjectStatus" NOT NULL DEFAULT 'OPEN',
    "accepted_coins" "TokenType"[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" SERIAL NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tokenType" "TokenType" NOT NULL DEFAULT 'SOL',
    "message" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "contributorAddress" TEXT NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socials" (
    "id" SERIAL NOT NULL,
    "website" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "projectAddress" TEXT NOT NULL,

    CONSTRAINT "Socials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_accountAddress_key" ON "Project"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_accountAddress_key" ON "Contribution"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

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
