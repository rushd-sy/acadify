import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UserDto } from 'dtos';
import { UserDomain } from '../domain/user.domain';

@Injectable()
export class UserMapper {
  toUserDto(user: User): UserDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
  }

  toUserDtos(users: User[]): UserDto[] {
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

  toNewUserDomain(createUserDto: CreateUserDto): UserDomain {
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
