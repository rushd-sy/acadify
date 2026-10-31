-- Prevent assigning the same teacher to a section more than once.
CREATE UNIQUE INDEX "SectionCurriculumTeacher_userId_sectionId_key"
ON "SectionCurriculumTeacher"("userId", "sectionId");
