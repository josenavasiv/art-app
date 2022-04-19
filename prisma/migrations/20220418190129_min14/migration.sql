/*
  Warnings:

  - You are about to drop the column `uploadId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `uploadId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Upload` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artworkId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artworkId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_uploadId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_uploadId_fkey";

-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_authorId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "uploadId",
ADD COLUMN     "artworkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "uploadId",
ADD COLUMN     "artworkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Upload";

-- CreateTable
CREATE TABLE "Artwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "mature" BOOLEAN NOT NULL DEFAULT false,
    "section" "Section" NOT NULL DEFAULT E'COMMUNITY',
    "subjects" "Subject"[],
    "authorName" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
