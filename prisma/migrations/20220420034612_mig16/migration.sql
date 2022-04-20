/*
  Warnings:

  - Made the column `headline` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "headline" SET NOT NULL,
ALTER COLUMN "headline" SET DEFAULT E'New User';
