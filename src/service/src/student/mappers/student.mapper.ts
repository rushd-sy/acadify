import { Injectable } from '@nestjs/common';

import {
  CreateStudentDto,
  Role,
  StudentDetailsDto,
  StudentDto,
  UpdateStudentDto,
} from 'dtos';

import { StudentDomain } from '../domain/student.domain';

import { UserDomain } from '../../auth/domain/user.domain';

import { StudentWithUser } from '../types/student-user.type';

@Injectable()
export class StudentMapper {
  toStudentDto(student: StudentWithUser): StudentDto {
    return {
      id: student.id,
      userId: student.userId,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      role: Role.STUDENT,
    };
  }

  toStudentDtoList(students: StudentWithUser[]): StudentDto[] {
    return students.map((student) => this.toStudentDto(student));
  }

  toStudentDetailsDto(student: StudentWithUser): StudentDetailsDto {
    return {
      id: student.id,
      userId: student.userId,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      phoneNumber: student.user.phoneNumber,
      role: Role.STUDENT,
    };
  }

  toDomainFromCreateDto(createStudentDto: CreateStudentDto): StudentDomain {
    const userDomain = UserDomain.create({
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      phoneNumber: createStudentDto.phoneNumber,
      hashedPassword: createStudentDto.hashedPassword,
    });

    return StudentDomain.create(userDomain);
  }

  toUpdateUserData(updateStudentDto: UpdateStudentDto): UpdateStudentDto {
    return {
      firstName: updateStudentDto.firstName,
      lastName: updateStudentDto.lastName,
      email: updateStudentDto.email,
      phoneNumber: updateStudentDto.phoneNumber,
    };
  }
}
