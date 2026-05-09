import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('/api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  @Get()
  getStudents(): string[] {
    return ['Yehya', 'Adel', 'Mohammad', 'Moaaz'];
  }
}
