import { Injectable } from '@nestjs/common';

import {
  CreateTeacherDto,
  TeacherDetailsDto,
  TeacherDto,
  UpdateTeacherDto,
} from 'dtos';

import { TeacherDomain } from '../domain/teacher.domain';
import { UserDomain } from '../../auth/domain/user.domain';
import { TeacherWithUser } from '../types/teacher-user.type';

@Injectable()
export class TeacherMapper {
  toTeacherDto(teacher: TeacherWithUser): TeacherDto {
    return {
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      degree: teacher.degree,
    };
  }

  toTeacherDtoList(teachers: TeacherWithUser[]): TeacherDto[] {
    return teachers.map((teacher) => this.toTeacherDto(teacher));
  }

  toTeacherDetailsDto(teacher: TeacherWithUser): TeacherDetailsDto {
    return {
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      phoneNumber: teacher.user.phoneNumber,
      degree: teacher.degree,
    };
  }

  toDomainFromCreateDto(createTeacherDto: CreateTeacherDto): TeacherDomain {
    const userDomain = UserDomain.create({
      firstName: createTeacherDto.firstName,
      lastName: createTeacherDto.lastName,
      email: createTeacherDto.email,
      phoneNumber: createTeacherDto.phoneNumber,
      hashedPassword: createTeacherDto.hashedPassword,
    });

    return TeacherDomain.create({
      user: userDomain,
      degree: createTeacherDto.degree,
    });
  }

  toUpdateUserData(updateTeacherDto: UpdateTeacherDto): UpdateTeacherDto {
    return {
      firstName: updateTeacherDto.firstName,
      lastName: updateTeacherDto.lastName,
      email: updateTeacherDto.email,
      phoneNumber: updateTeacherDto.phoneNumber,
    };
  }
}
