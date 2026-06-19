import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { StudentDto, CreateStudentDto } from 'dtos';

@Injectable()
export class StudentMapper {

  toDTO(student: Student): StudentDto {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
    };
  }

  toDTOs(students: Student[]): StudentDto[] {
    return students.map((student) => this.toDTO(student));
  }

  toPersistence(createStudentDto: CreateStudentDto): Omit<Student, 'id'> {
    return {
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      email: createStudentDto.email,
      phoneNumber: createStudentDto.phoneNumber,
    };
  }
}