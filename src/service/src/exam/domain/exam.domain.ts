export class ExamDomain {
  id: number;
  examTemplateId?: number;
  title: string;
  date: Date;
  documentUrl?: string;
  minScore: number;
  maxScore: number;

  private constructor(input: {
    id: number;
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    minScore: number;
    maxScore: number;
  }) {
    this.id = input.id;
    this.examTemplateId = input.examTemplateId;
    this.title = input.title;
    this.date = input.date;
    this.documentUrl = input.documentUrl;
    this.minScore = input.minScore;
    this.maxScore = input.maxScore;
  }

  static fromPersistence(input: {
    id: number;
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    minScore: number;
    maxScore: number;
  }): ExamDomain {
    return new ExamDomain(input);
  }
}
