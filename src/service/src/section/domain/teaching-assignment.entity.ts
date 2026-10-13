export class TeachingAssignment {
  private constructor(
    readonly id: number | null,
    readonly teacherId: number,
    readonly curriculumId: number,
  ) {}

  static create(teacherid: number, curriculumId: number): TeachingAssignment {
    return new TeachingAssignment(null, teacherid, curriculumId);
  }

  static fromPersistence(
    id: number,
    teacherId: number,
    curriculumId: number,
  ): TeachingAssignment {
    return new TeachingAssignment(id, teacherId, curriculumId);
  }

  matches(teacherId: number, curriculumId: number): boolean {
    const isMatch =
      this.teacherId === teacherId && this.curriculumId === curriculumId;
    return isMatch;
  }
}
