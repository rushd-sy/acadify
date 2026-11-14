import { TraceableDomain } from 'src/utils/traceable.domain';

export class ExamSection extends TraceableDomain {
  id?: number;
  examId!: number;
  sectionId!: number;
  startAt!: Date;
  duration!: number;

  private constructor(input: {
    id?: number;
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
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
  }

  static create(input: {
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
    createdBy: number;
  }): ExamSection {
    const now = new Date();

    return new ExamSection({
      id: -1,
      ...input,
      createdAt: now,
    });
  }

  static fromPersistence(input: {
    id: number;
    examId: number;
    sectionId: number;
    startAt: Date;
    duration: number;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): ExamSection {
    return new ExamSection(input);
  }
}
