-- CreateTable
CREATE TABLE "Exam" (
    "UniqueID" SERIAL NOT NULL,
    "examTemplateId" INTEGER,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("UniqueID")
);
