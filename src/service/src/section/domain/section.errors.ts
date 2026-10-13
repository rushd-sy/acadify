export abstract class SectionDomainError extends Error {}

export class InvalidSectionNameError extends SectionDomainError {
  constructor(name: string) {
    super(
      `Invalid section name: "${name}". Name must be between 1 and 50 characters.`,
    );
  }
}

export class InvalidAcademicYearError extends SectionDomainError {
  constructor(year: string) {
    super(
      `Invalid academic year format: "${year}". Expected format "YYYY/YYYY" (e.g 2026/2027).`,
    );
  }
}

export class DuplicateAssignmentError extends SectionDomainError {
  constructor(teacherId: number, curriculumId: number) {
    super(
      `Teacher ${teacherId} is already assigned to curriculum ${curriculumId} in this section.`,
    );
  }
}

export class AssignmentNotFoundError extends SectionDomainError {
  constructor(teacherId: number, curriculumId: number) {
    super(
      ` Assignment not found for teacher ${teacherId} and curriculum ${curriculumId}.`,
    );
  }
}

export class SectionNameTakenError extends SectionDomainError {
  constructor(name: string) {
    super(`Section name "${name}" is already taken.`);
  }
}
