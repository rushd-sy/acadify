-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "examTemplateId" INTEGER,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "curriculumId" INTEGER,
    "documentUrl" TEXT,
    "minScore" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);
