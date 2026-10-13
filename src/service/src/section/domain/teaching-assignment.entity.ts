export class TeachingAssignment {
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

  static create(teacherId: number, curriculumId: number): TeachingAssignment {
    return new TeachingAssignment({ teacherId, curriculumId });
  }

  static fromPersistence(input: {
    id: number;
    teacherId: number;
    curriculumId: number;
  }): TeachingAssignment {
    return new TeachingAssignment(input);
  }

  matches(teacherId: number, curriculumId: number): boolean {
    const isMatch =
      this.teacherId === teacherId && this.curriculumId === curriculumId;
    return isMatch;
  }
}
