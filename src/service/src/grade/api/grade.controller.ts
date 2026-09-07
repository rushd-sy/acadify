import { Controller } from '@nestjs/common';
import { GradeService } from '../services/grade.service';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}
}
