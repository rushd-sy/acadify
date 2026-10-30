import { InvalidExamScoreRangeError } from './exam.errors';
export class ExamDomain {
  id: number;
  examTemplateId?: number;
  title: string;
  date: Date;
  documentUrl?: string;
  curriculumId?: number;
  minScore: number;
  maxScore: number;

  private constructor(input: {
    id: number;
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    curriculumId?: number;
    minScore: number;
    maxScore: number;
  }) {
    this.id = input.id;
    this.examTemplateId = input.examTemplateId;
    this.title = input.title;
    this.date = input.date;
    this.documentUrl = input.documentUrl;
    this.curriculumId = input.curriculumId;
    this.minScore = input.minScore;
    this.maxScore = input.maxScore;
  }

  static create(input: {
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    curriculumId?: number;
    minScore: number;
    maxScore: number;
  }): ExamDomain {
    ExamDomain.assertScoreRange(input.minScore, input.maxScore);
    return new ExamDomain({
      id: -1,
      ...input,
    });
  }

  private static assertScoreRange(minScore: number, maxScore: number): void {
    if (minScore <= 0 || maxScore <= 0 || maxScore <= minScore) {
      throw new InvalidExamScoreRangeError(minScore, maxScore);
    }
  }

  static fromPersistence(input: {
    id: number;
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    curriculumId?: number;
    minScore: number;
    maxScore: number;
  }): ExamDomain {
    return new ExamDomain(input);
  }
}
