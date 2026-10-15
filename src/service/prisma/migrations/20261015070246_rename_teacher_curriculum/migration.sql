/*
  Warnings:

  - You are about to drop the `TeacherCurriculum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeacherCurriculum" DROP CONSTRAINT "TeacherCurriculum_curriculumId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCurriculum" DROP CONSTRAINT "TeacherCurriculum_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCurriculum" DROP CONSTRAINT "TeacherCurriculum_userId_fkey";

-- DropTable
DROP TABLE "TeacherCurriculum";

-- CreateTable
CREATE TABLE "SectionCurriculumTeacher" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "curriculumId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "SectionCurriculumTeacher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SectionCurriculumTeacher" ADD CONSTRAINT "SectionCurriculumTeacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Teacher"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCurriculumTeacher" ADD CONSTRAINT "SectionCurriculumTeacher_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCurriculumTeacher" ADD CONSTRAINT "SectionCurriculumTeacher_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
