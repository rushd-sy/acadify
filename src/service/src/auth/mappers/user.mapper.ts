import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto, Role } from 'dtos';
import { UserDomain } from '../domain/user.domain';
import { User } from '@prisma/client';

@Injectable()
export class UserMapper {
  toUserDto(user: User & { student?; teacher?; admin? }): UserDto {
    let role: Role = Role.STUDENT;

    if (user.teacher) {
      role = Role.TEACHER;
    } else if (user.admin) {
      role = Role.ADMIN;
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: role,
    };
  }

  toUserDtoList(users: User[]): UserDto[] {
    return users.map((user) => this.toUserDto(user));
  }

  toDomain(user: User): UserDomain {
    return UserDomain.fromPersistence({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      hashedPassword: user.hashedPassword,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
      updatedBy: user.updatedBy ?? undefined,
      updatedAt: user.updatedAt ?? undefined,
      archivedAt: user.archivedAt ?? undefined,
    });
  }

  toDomainFromCreateDto(
    createUserDto: CreateUserDto,
    actionById: number,
  ): UserDomain {
    return UserDomain.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      hashedPassword: createUserDto.hashedPassword,
      createdBy: actionById,
    });
  }

  toPersistence(
    user: UserDomain,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      hashedPassword: user.hashedPassword,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy ?? null,
      archivedAt: user.archivedAt ?? null,
    };
  }
}
