import { SectionTeachingAssignment } from './section-teaching-assignment.entity';
import {
  InvalidAcademicYearError,
  InvalidSectionNameError,
  DuplicateAssignmentError,
  AssignmentNotFoundError,
} from './section.errors';

export class SectionDomain {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachingAssignments!: SectionTeachingAssignment[];

  private constructor(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
    assignments: SectionTeachingAssignment[];
  }) {
    this.id = input.id;
    this.name = input.name;
    this.academicYear = input.academicYear;
    this.gradeId = input.gradeId;
    this.teachingAssignments = input.assignments;
  }

  static create(input: {
    name: string;
    academicYear: string;
    gradeId: number;
  }): SectionDomain {
    const trimmedName = input.name.trim();
    SectionDomain.assertName(trimmedName);
    SectionDomain.assertAcademicYear(input.academicYear);
    return new SectionDomain({
      id: -1,
      name: trimmedName,
      academicYear: input.academicYear,
      gradeId: input.gradeId,
      assignments: [],
    });
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
    assignments: SectionTeachingAssignment[];
  }): SectionDomain {
    return new SectionDomain(input);
  }

  private static assertName(raw: string): string {
    if (raw.length < 1 || raw.length > 50) {
      throw new InvalidSectionNameError(raw);
    }
    return raw;
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

  rename(name: string) {
    this.name = SectionDomain.assertName(name.trim());
  }

  changeAcademicYear(year: string) {
    this.academicYear = SectionDomain.assertAcademicYear(year);
  }

  assignTeacher(teacherId: number, curriculumId: number) {
    const isAssigned = this.teachingAssignments.some((assignment) =>
      assignment.matches(teacherId, curriculumId),
    );
    if (isAssigned) {
      throw new DuplicateAssignmentError(teacherId, curriculumId);
    }
    return this.teachingAssignments.push(
      SectionTeachingAssignment.create(teacherId, curriculumId),
    );
  }

  unassignTeacher(teacherId: number, curriculumId: number) {
    const beforeCount = this.teachingAssignments.length;
    this.teachingAssignments = this.teachingAssignments.filter(
      (assignment) => !assignment.matches(teacherId, curriculumId),
    );
    if (this.teachingAssignments.length === beforeCount) {
      throw new AssignmentNotFoundError(teacherId, curriculumId);
    }
  }
}
