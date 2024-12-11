-- CreateTable
CREATE TABLE "ReleaseExams" (
    "id" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "grade" INTEGER,
    "position" INTEGER,
    "totalScore" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "ReleaseExams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseExams_termId_studentId_examId_key" ON "ReleaseExams"("termId", "studentId", "examId");

-- AddForeignKey
ALTER TABLE "ReleaseExams" ADD CONSTRAINT "ReleaseExams_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseExams" ADD CONSTRAINT "ReleaseExams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseExams" ADD CONSTRAINT "ReleaseExams_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseExams" ADD CONSTRAINT "ReleaseExams_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Examination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
