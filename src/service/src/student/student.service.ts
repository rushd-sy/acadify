import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  private readonly studentsArray: { name: string; age: number }[] = [
    { name: 'Yehya', age: 22 },
    { name: 'Adel', age: 21 },
    { name: 'Mohammad', age: 23 },
    { name: 'Moaaz', age: 20 },
  ];

  getStudents(): { name: string; age: number }[] {
    return this.studentsArray;
  }
}
