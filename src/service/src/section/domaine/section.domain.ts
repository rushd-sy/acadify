export class SectionDomain {
  id: number;
  name: string;
  academicYear: string;
  gradeId: number;

  private constructor(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.academicYear = input.academicYear;
    this.gradeId = input.gradeId;
  }

  static create(input: {
    name: string;
    academicYear: string;
    gradeId: number;
  }): SectionDomain {
    return new SectionDomain({
      id: -1,
      name: input.name,
      academicYear: input.academicYear,
      gradeId: input.gradeId,
    });
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
  }): SectionDomain {
    return new SectionDomain(input);
  }
}
