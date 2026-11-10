export class TeacherDto {
  userId!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  degree!: string;
  createdBy?: number;
  createdAt!: Date;
  updatedBy?: number;
  updatedAt!: Date;
  archivedAt?: Date;
}
