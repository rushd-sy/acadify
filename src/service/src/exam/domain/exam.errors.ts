export abstract class ExamDomainError extends Error {}

export class InvalidExamScoreRangeError extends ExamDomainError {
  constructor(minScore: number, maxScore: number) {
    super(
      `Invalid exam score range: minimum score (${minScore}) must be greater than 0 and less than maximum score (${maxScore}).`,
    );
  }
}
