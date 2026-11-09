export class ExamSectionDto {
  id!: number;
  examId!: number;
  sectionId!: number;
  startAt!: Date;
  endAt!: Date;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date;
  archivedAt?: Date;
}
