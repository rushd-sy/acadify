import { StudentDto } from './student.dto';
import { Role } from '../auth';

export class StudentDetailsDto extends StudentDto {
  phoneNumber!: string;
  role?: Role;
}
