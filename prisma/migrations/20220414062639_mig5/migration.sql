/*
  Warnings:

  - The values [EXPERIENCED] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [TUTORIAL] on the enum `Section` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('BEGINNER', 'CASUAL', 'SEASONED', 'PROFESSIONAL');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CASUAL';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Section_new" AS ENUM ('COMMUNITY', 'FEEDBACK', 'RESOURCES');
ALTER TABLE "Upload" ALTER COLUMN "section" DROP DEFAULT;
ALTER TABLE "Upload" ALTER COLUMN "section" TYPE "Section_new" USING ("section"::text::"Section_new");
ALTER TYPE "Section" RENAME TO "Section_old";
ALTER TYPE "Section_new" RENAME TO "Section";
DROP TYPE "Section_old";
ALTER TABLE "Upload" ALTER COLUMN "section" SET DEFAULT 'COMMUNITY';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "backroundImage64" TEXT;
