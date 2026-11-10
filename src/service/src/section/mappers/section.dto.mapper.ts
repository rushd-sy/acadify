import { Injectable } from '@nestjs/common';
import {
  SectionCurriculumTeacherDto,
  SectionDto,
  SectionStudentDto,
} from 'dtos';
import { AssembledSectionData } from '../data/section-assembled-data';
import {
  SectionCurriculumTeacherWithRelations,
  StudentSectionWithRelations,
} from '../types/section.type';

@Injectable()
export class SectionDtoMapper {
  toDto(assembledData: AssembledSectionData): SectionDto {
    return {
      id: assembledData.section.id,
      name: assembledData.section.name,
      academicYear: assembledData.section.academicYear,
      gradeId: assembledData.section.gradeId,
      teachers: assembledData.teachers || [],
      students: assembledData.students || [],
    };
  }

  toDtoList(assembledDataList: AssembledSectionData[]): SectionDto[] {
    return assembledDataList.map((data) => this.toDto(data));
  }

  toSectionCurriculumTeacherDto(
    data: SectionCurriculumTeacherWithRelations,
  ): SectionCurriculumTeacherDto {
    return {
      teacherId: data.userId,
      teacherFirstName: data.teacher.user.firstName,
      teacherLastName: data.teacher.user.lastName,
      curriculumName: data.curriculum.name,
    };
  }

  toSectionStudentDto(data: StudentSectionWithRelations): SectionStudentDto {
    return {
      studentId: data.student.user.id,
      studentFirstName: data.student.user.firstName,
      studentLastName: data.student.user.lastName,
      email: data.student.user.email,
    };
  }
}
