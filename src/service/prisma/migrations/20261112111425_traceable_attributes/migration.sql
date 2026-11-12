/*
  Warnings:

  - Made the column `createdBy` on table `Curriculum` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Exam` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `ExamSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Grade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `SectionCurriculumTeacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `StudentSection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Teacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Curriculum" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Curriculum" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "Exam" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Exam" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "ExamSection" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "ExamSection" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "Grade" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Grade" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "Section" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Section" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "SectionCurriculumTeacher" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "SectionCurriculumTeacher" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "Student" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Student" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "StudentSection" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "StudentSection" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "Teacher" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "Teacher" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
UPDATE "User" SET "createdBy" = 0 WHERE "createdBy" IS NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "createdBy" SET NOT NULL;
