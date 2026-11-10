export class GradeDto {
  id!: number;
  name!: string;
  createdBy?: number;
  createdAt!: Date;
  updatedBy?: number;
  updatedAt!: Date;
  archivedAt?: Date;
}
