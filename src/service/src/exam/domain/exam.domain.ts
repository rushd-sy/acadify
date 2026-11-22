import {
  DuplicateExamSectionError,
  InvalidExamScoreRangeError,
} from './exam.errors';
import { TraceableDomain } from 'src/utils/traceable.domain';
import { ExamSection } from './exam-section.entity';

export class ExamDomain extends TraceableDomain {
  id: number;
  examTemplateId?: number;
  title: string;
  date: Date;
  documentUrl?: string;
  curriculumId?: number;
  minScore: number;
  maxScore: number;
  examSections: ExamSection[];

  private constructor(input: {
    id: number;
    examTemplateId?: number;
    title: string;
    date: Date;
    documentUrl?: string;
    curriculumId?: number;
    minScore: number;
    maxScore: number;
    examSections: ExamSection[];
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.id = input.id;
    this.examTemplateId = input.examTemplateId;
    this.title = input.title;
    this.date = input.date;
    this.documentUrl = input.documentUrl;
    this.curriculumId = input.curriculumId;
    this.minScore = input.minScore;
    this.maxScore = input.maxScore;
    this.examSections = input.examSections;
  }

  static create(
    input: {
      examTemplateId?: number;
      title: string;
      date: Date;
      documentUrl?: string;
      curriculumId?: number;
      minScore: number;
      maxScore: number;
    },
    createdBy: number,
  ): ExamDomain {
    ExamDomain.assertScoreRange(input.minScore, input.maxScore);
    return new ExamDomain({
      id: -1,
      ...input,
      examSections: [],
      createdBy,
      createdAt: new Date(),
    });
  }

  private static assertScoreRange(minScore: number, maxScore: number): void {
    if (minScore < 0 || maxScore <= 0 || maxScore <= minScore) {
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
    examSections: ExamSection[];
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): ExamDomain {
    return new ExamDomain(input);
  }

  assignSections(sections: ExamSection[]): void {
    const sectionIds = new Set(
      this.examSections.map((section) => section.sectionId),
    );

    for (const section of sections) {
      if (sectionIds.has(section.sectionId)) {
        throw new DuplicateExamSectionError(section.sectionId);
      }

      sectionIds.add(section.sectionId);
    }

    this.examSections.push(...sections);
  }
}
