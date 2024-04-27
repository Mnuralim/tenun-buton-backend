/*
  Warnings:

  - Made the column `email_verify_token` on table `Auth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "email_verify_token" SET NOT NULL;
