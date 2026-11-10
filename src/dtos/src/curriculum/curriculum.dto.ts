export class CurriculumDto {
  id!: number;
  name!: string;
  description?: string;
  createdBy?: number;
  createdAt!: Date;
  updatedBy?: number;
  updatedAt!: Date;
  archivedAt?: Date;
}
