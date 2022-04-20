/*
  Warnings:

  - You are about to drop the column `authorName` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "authorName";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "showMatureContent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
