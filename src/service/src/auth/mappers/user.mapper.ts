import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from 'dtos';
import { UserDomain } from '../domain/user.domain';
import { User } from '@prisma/client';

@Injectable()
export class UserMapper {
  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
      hashedPassword: user.hashedPassword,
    });
  }

  toDomainFromCreateDto(createUserDto: CreateUserDto): UserDomain {
    return UserDomain.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      hashedPassword: createUserDto.hashedPassword,
    });
  }

  toPersistence(user: UserDomain): Omit<UserDomain, 'id'> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hashedPassword: user.hashedPassword,
    };
  }
}
