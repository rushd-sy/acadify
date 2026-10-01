-- CreateTable
CREATE TABLE "TeacherCurriculum" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "curriculumId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "TeacherCurriculum_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeacherCurriculum" ADD CONSTRAINT "TeacherCurriculum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Teacher"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCurriculum" ADD CONSTRAINT "TeacherCurriculum_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCurriculum" ADD CONSTRAINT "TeacherCurriculum_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
