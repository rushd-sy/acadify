export abstract class ExamDomainError extends Error {}

export class InvalidExamScoreRangeError extends ExamDomainError {
  constructor(minScore: number, maxScore: number) {
    super(
      `Invalid exam score range: minimum score (${minScore}) must be equal to or greater than 0, maximum score (${maxScore}) must be greater than 0, and minimum score must be less than maximum score.`,
    );
  }
}
