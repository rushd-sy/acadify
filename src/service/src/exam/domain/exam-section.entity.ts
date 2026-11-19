import { TraceableDomain } from 'src/utils/traceable.domain';
import { InvalidExamSectionDurationError } from './exam.errors';

export class ExamSection extends TraceableDomain {
  id: number;
  examId!: number;
  sectionId!: number;
  startAt!: Date;
  duration!: number;
  sectionName?: string;
  academicYear?: string;
  gradeId?: number;

  private constructor(input: {
    id: number;
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
    sectionName?: string;
    academicYear?: string;
    gradeId?: number;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    super({
      createdBy: input.createdBy,
      createdAt: input.createdAt,
      updatedBy: input.updatedBy,
      updatedAt: input.updatedAt,
      archivedAt: input.archivedAt,
    });

    this.id = input.id;
    this.examId = input.examId;
    this.sectionId = input.sectionId;
    this.startAt = input.startAt;
    this.duration = input.duration;
    this.sectionName = input.sectionName;
    this.academicYear = input.academicYear;
    this.gradeId = input.gradeId;
  }

  static create(input: {
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
    createdBy: number;
  }): ExamSection {
    ExamSection.assertValidDuration(input.duration);
    const now = new Date();

    return new ExamSection({
      id: -1,
      ...input,
      createdAt: now,
    });
  }

  private static assertValidDuration(duration: number): void {
    if (duration <= 0) {
      throw new InvalidExamSectionDurationError(duration);
    }
  }

  static fromPersistence(input: {
    id: number;
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
    sectionName?: string;
    academicYear?: string;
    gradeId?: number;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): ExamSection {
    return new ExamSection(input);
  }
}
