import { SectionDomain } from '../domain/section.domain';
import { SectionCurriculumTeacherDto } from 'dtos';
import { SectionStudentDto } from 'dtos';

export interface AssembledSectionData {
  section: SectionDomain;
  teachers: SectionCurriculumTeacherDto[];
  students: SectionStudentDto[];
}
