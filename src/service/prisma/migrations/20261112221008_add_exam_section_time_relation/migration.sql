/*
  Warnings:

  - Added the required column `duration` to the `ExamSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `ExamSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamSection" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
