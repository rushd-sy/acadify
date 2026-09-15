-- CreateTable
CREATE TABLE "Teacher" (
    "userId" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
