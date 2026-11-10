export class ExamDto {
  id!: number;
  examTemplateId?: number;
  title!: string;
  date!: Date;
  curriculumId?: number;
  documentUrl?: string;
  minScore!: number;
  maxScore!: number;
}
