import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { StudentDto, CreateStudentDto, StudentDetailsDto } from 'dtos';
import type { NewStudentDomain, StudentDomain } from '../domain/student.domain';

@Injectable()
export class StudentMapper {
  toStudentDTO(student: Student): StudentDto {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
    };
  }

  toStudentDTOs(students: Student[]): StudentDto[] {
    return students.map((student) => this.toStudentDTO(student));
  }

  toStudentDetailsDTO(student: Student): StudentDetailsDto {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
    };
  }

  toDomain(student: Student): StudentDomain {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      hashedPassword: student.hashedPassword,
    };
  }

  toNewStudentDomain(createStudentDto: CreateStudentDto): NewStudentDomain {
    return {
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      phoneNumber: createStudentDto.phoneNumber,
      hashedPassword: createStudentDto.hashedPassword,
    };
  }

  toPresistence(student: NewStudentDomain): Omit<Student, 'id'> {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      hashedPassword: student.hashedPassword,
    };
  }
}
