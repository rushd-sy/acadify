import { Injectable } from '@nestjs/common';
import { Student as PrismaStudent } from '@prisma/client';
import { CreateStudentDto, StudentDetailsDto, StudentDto } from 'dtos';
import { StudentDomain } from './domain/student.domain';

@Injectable()
export class StudentMapper {
  toDomain(student: PrismaStudent): StudentDomain {
    return StudentDomain.fromPersistence({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      hashedPassword: student.hashedPassword,
    });
  }

  toDomainFromCreateDto(data: CreateStudentDto): StudentDomain {
    return StudentDomain.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      hashedPassword: data.hashedPassword,
    });
  }

  toPersistence(student: StudentDomain): Omit<PrismaStudent, 'id'> {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      hashedPassword: student.hashedPassword,
    };
  }

  toStudentDTO(student: StudentDomain): StudentDto {
    return {
      id: student.id!,
      firstName: student.firstName,
      lastName: student.lastName,
    };
  }

  toStudentDTOs(students: StudentDomain[]): StudentDto[] {
    return students.map((student) => this.toStudentDTO(student));
  }

  toStudentDetailsDTO(student: StudentDomain): StudentDetailsDto {
    return {
      id: student.id!,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
    };
  }
}
