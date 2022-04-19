/*
  Warnings:

  - You are about to drop the column `image64` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail64` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `backroundImage64` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "image64",
DROP COLUMN "thumbnail64",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "backroundImage64",
DROP COLUMN "image",
ADD COLUMN     "backgroundImageUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT;
