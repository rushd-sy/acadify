-- CreateTable
CREATE TABLE "ExamSection" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "ExamSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamSection_sectionId_idx" ON "ExamSection"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSection_examId_sectionId_key" ON "ExamSection"("examId", "sectionId");

-- AddForeignKey
ALTER TABLE "ExamSection" ADD CONSTRAINT "ExamSection_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSection" ADD CONSTRAINT "ExamSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
