/*
  Warnings:

  - Made the column `uploadedBy` on table `Upload` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Upload" ALTER COLUMN "uploadedBy" SET NOT NULL;
