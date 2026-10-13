import { SectionDomain } from '../domain/section.domain';

export interface AssembledSectionData {
  section: SectionDomain;
  teachers: {
    userId: number;
    firstName: string;
    lastName: string;
    curriculumName: string;
  }[];
}
