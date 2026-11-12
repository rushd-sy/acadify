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
ALTER TABLE "Curriculum" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExamSection" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SectionCurriculumTeacher" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentSection" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;
