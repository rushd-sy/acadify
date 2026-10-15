export class SectionCurriculumTeacher {
  id?: number;
  teacherId!: number;
  curriculumId!: number;

  private constructor(input: {
    id?: number;
    teacherId: number;
    curriculumId: number;
  }) {
    this.id = input.id;
    this.teacherId = input.teacherId;
    this.curriculumId = input.curriculumId;
  }

  static create(
    teacherId: number,
    curriculumId: number,
  ): SectionCurriculumTeacher {
    return new SectionCurriculumTeacher({ teacherId, curriculumId });
  }

  static fromPersistence(input: {
    id: number;
    teacherId: number;
    curriculumId: number;
  }): SectionCurriculumTeacher {
    return new SectionCurriculumTeacher(input);
  }

  matches(teacherId: number, curriculumId: number): boolean {
    const isMatch =
      this.teacherId === teacherId && this.curriculumId === curriculumId;
    return isMatch;
  }
}
