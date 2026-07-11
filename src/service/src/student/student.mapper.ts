import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { CreateStudentDto, StudentDetailsDto, StudentDto } from 'dtos';

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

  toPersistence(student: CreateStudentDto): Omit<Student, 'id'> {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      hashedPassword: student.hashedPassword,
    };
  }
}
