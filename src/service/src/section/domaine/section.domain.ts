export interface TeacherCurriculumInfo {
  teacherId: number;
  teacher: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  curriculum: {
    name: string;
  };
}

export class SectionDomain {
  id: number;
  name: string;
  academicYear: string;
  gradeId: number;
  teacherCurriculums?: TeacherCurriculumInfo[];

  private constructor(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
    teacherCurriculums?: TeacherCurriculumInfo[];
  }) {
    this.id = input.id;
    this.name = input.name;
    this.academicYear = input.academicYear;
    this.gradeId = input.gradeId;
    this.teacherCurriculums = input.teacherCurriculums;
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
    teacherCurriculums?: TeacherCurriculumInfo[];
  }): SectionDomain {
    return new SectionDomain(input);
  }
}
