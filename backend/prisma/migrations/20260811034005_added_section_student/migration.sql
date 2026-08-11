-- CreateTable
CREATE TABLE "SectionStudent" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "SectionStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionStudent_sectionId_studentId_key" ON "SectionStudent"("sectionId", "studentId");

-- AddForeignKey
ALTER TABLE "SectionStudent" ADD CONSTRAINT "SectionStudent_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
