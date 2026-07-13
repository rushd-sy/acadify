import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from 'dtos';
import { UserDomain } from '../domain/user.domain';
import { User } from '@prisma/client';

@Injectable()
export class UserMapper {
  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
  }

  toUserDtoList(users: User[]): UserDto[] {
    return users.map((user) => this.toUserDto(user));
  }

  toDomain(user: User): UserDomain {
    return UserDomain.fromPersistence({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      hashedPassword: user.hashedPassword,
    });
  }

  toDomainFromCreateDto(createUserDto: CreateUserDto): UserDomain {
    return UserDomain.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      hashedPassword: createUserDto.hashedPassword,
    });
  }

  toPersistence(user: UserDomain): Omit<User, 'id'> {
    return {
      fullName: user.fullName,
      email: user.email,
      hashedPassword: user.hashedPassword,
    };
  }
}
