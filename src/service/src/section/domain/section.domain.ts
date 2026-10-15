import { SectionCurriculumTeacher } from './section-teaching-assignment.entity';
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
  sectionCurriculumTeachers!: SectionCurriculumTeacher[];

  private constructor(input: {
    id: number;
    name: string;
    academicYear: string;
    gradeId: number;
    assignments: SectionCurriculumTeacher[];
  }) {
    this.id = input.id;
    this.name = input.name;
    this.academicYear = input.academicYear;
    this.gradeId = input.gradeId;
    this.sectionCurriculumTeachers = input.assignments;
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
    assignments: SectionCurriculumTeacher[];
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
    const isAssigned = this.sectionCurriculumTeachers.some((assignment) =>
      assignment.matches(teacherId, curriculumId),
    );
    if (isAssigned) {
      throw new DuplicateAssignmentError(teacherId, curriculumId);
    }
    return this.sectionCurriculumTeachers.push(
      SectionCurriculumTeacher.create(teacherId, curriculumId),
    );
  }

  unassignTeacher(teacherId: number, curriculumId: number) {
    const beforeCount = this.sectionCurriculumTeachers.length;
    this.sectionCurriculumTeachers = this.sectionCurriculumTeachers.filter(
      (assignment) => !assignment.matches(teacherId, curriculumId),
    );
    if (this.sectionCurriculumTeachers.length === beforeCount) {
      throw new AssignmentNotFoundError(teacherId, curriculumId);
    }
  }
}
