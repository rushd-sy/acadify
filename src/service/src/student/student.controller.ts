import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('/api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  @Get()
  getStudents(): {name: string, age: number}[] {
    return this.studentService.getStudents();
  }
}
