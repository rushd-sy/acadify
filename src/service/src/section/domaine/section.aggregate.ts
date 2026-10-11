import { TeachingAssignment } from './teaching-assignment.entity';
import {
  InvalidAcademicYearError,
  InvalidSectionNameError,
  DuplicateAssignmentError,
  AssignmentNotFoundError,
} from './section.errors';

export class Section {
  private constructor(
    readonly id: number | null,
    private _name: string,
    private _academicYear: string,
    private _gradeId: number,
    private _assignments: TeachingAssignment[],
  ) {}

  static create(input: {
    name: string;
    academicYear: string;
    gradeId: number;
  }): Section {
    return new Section(
      null,
      Section.assertName(input.name),
      Section.assertAcademicYear(input.academicYear),
      input.gradeId,
      [],
    );
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
    assignments: TeachingAssignment[];
  }): Section {
    return new Section(
      input.id,
      input.name,
      input.academicYear,
      input.gradeId,
      input.assignments,
    );
  }

  private static assertName(raw: string): string {
    const s = raw.trim();
    if (s.length < 1 || s.length > 50) {
      throw new InvalidSectionNameError(raw);
    }
    return s;
  }

  private static assertAcademicYear(raw: string): string {
    const isInvalidFormat = !/^\d{4}\/\d{4}$/.test(raw);
    const areYearsNotConsecutive = +raw.slice(5) !== +raw.slice(0, 4) + 1;
    const isInvalid = isInvalidFormat || areYearsNotConsecutive;
    if (isInvalid) {
      throw new InvalidAcademicYearError(raw);
    }
    return raw;
  }

  get name() {
    return this._name;
  }
  get academicYear() {
    return this._academicYear;
  }
  get gradeId() {
    return this._gradeId;
  }
  get assignments(): readonly TeachingAssignment[] {
    return this._assignments;
  }

  rename(name: string) {
    this._name = Section.assertName(name);
  }

  changeAcademicYear(year: string) {
    this._academicYear = Section.assertAcademicYear(year);
  }

  assignTeacher(teacherId: number, curriculumId: number) {
    const isAssigned = this._assignments.some((a) =>
      a.matches(teacherId, curriculumId),
    );
    if (isAssigned) {
      throw new DuplicateAssignmentError(teacherId, curriculumId);
    }
    return this._assignments.push(
      TeachingAssignment.create(teacherId, curriculumId),
    );
  }

  unassignedTeacher(teacherId: number, curriculumId: number) {
    const beforeCount = this._assignments.length;
    this._assignments = this._assignments.filter(
      (a) => !a.matches(teacherId, curriculumId),
    );
    if (this._assignments.length === beforeCount) {
      throw new AssignmentNotFoundError(teacherId, curriculumId);
    }
  }
}
