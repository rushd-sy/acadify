export class ExamSectionDto {
  id!: number;
  examId!: number;
  sectionId!: number;
  sectionName?: string;
  academicYear?: string;
  gradeId?: number;
  startAt!: Date;
  duration!: number;
}
