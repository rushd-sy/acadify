import { TeachingAssignment } from './teaching-assignment.entity';
import {
  InvalidAcademicYearError,
  InvalidSectionNameError,
  DuplicateAssignmentError,
  AssignmentNotFoundError,
} from './section.errors';

export interface SectionProps {
  name: string;
  academicYear: string;
  gradeId: number;
  assignments: TeachingAssignment[];
}
export class Section {
  private constructor(
    readonly id: number | null,
    private props: SectionProps,
  ) {}

  static create(input: {
    name: string;
    academicYear: string;
    gradeId: number;
  }): Section {
    return new Section(null, {
      name: Section.assertName(input.name),
      academicYear: Section.assertAcademicYear(input.academicYear),
      gradeId: input.gradeId,
      assignments: [],
    });
  }

  static fromPersistence(
    input: {
      id: number;
    } & SectionProps,
  ): Section {
    const { id, ...props } = input;
    return new Section(id, props);
  }

  private static assertName(raw: string): string {
    const trimmedName = raw.trim();
    if (trimmedName.length < 1 || trimmedName.length > 50) {
      throw new InvalidSectionNameError(raw);
    }
    return trimmedName;
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
    return this.props.name;
  }
  get academicYear() {
    return this.props.academicYear;
  }
  get gradeId() {
    return this.props.gradeId;
  }
  get assignments(): readonly TeachingAssignment[] {
    return this.props.assignments;
  }

  rename(name: string) {
    this.props.name = Section.assertName(name);
  }

  changeAcademicYear(year: string) {
    this.props.academicYear = Section.assertAcademicYear(year);
  }

  assignTeacher(teacherId: number, curriculumId: number) {
    const isAssigned = this.props.assignments.some((assignment) =>
      assignment.matches(teacherId, curriculumId),
    );
    if (isAssigned) {
      throw new DuplicateAssignmentError(teacherId, curriculumId);
    }
    return this.props.assignments.push(
      TeachingAssignment.create(teacherId, curriculumId),
    );
  }

  unassignedTeacher(teacherId: number, curriculumId: number) {
    const beforeCount = this.props.assignments.length;
    this.props.assignments = this.props.assignments.filter(
      (assignment) => !assignment.matches(teacherId, curriculumId),
    );
    if (this.props.assignments.length === beforeCount) {
      throw new AssignmentNotFoundError(teacherId, curriculumId);
    }
  }
}
