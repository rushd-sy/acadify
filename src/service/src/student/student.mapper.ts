import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { StudentDto, CreateStudentDto, StudentDetailsDto } from 'dtos';

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

  toPersistence(createStudentDto: CreateStudentDto): Omit<Student, 'id'> {
    return {
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      phoneNumber: createStudentDto.phoneNumber,
      password: createStudentDto.password,
    };
  }
}
