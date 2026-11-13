import { TraceableDomain } from 'src/utils/traceable.domain';

export class CurriculumDomain extends TraceableDomain {
  id!: number;
  name!: string;
  description?: string;

  private constructor(input: {
    id: number;
    name: string;
    description?: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
  }

  static create(
    input: {
      name: string;
      description?: string;
    },
    createdBy: number,
  ): CurriculumDomain {
    return new CurriculumDomain({
      id: -1,
      name: input.name,
      description: input.description,
      createdBy,
      createdAt: new Date(),
    });
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    description?: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): CurriculumDomain {
    return new CurriculumDomain(input);
  }
}
