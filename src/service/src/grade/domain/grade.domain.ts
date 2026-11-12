import { TraceableDomain } from 'src/utils/traceable.domain';

export class GradeDomain extends TraceableDomain {
  id: number;
  name: string;

  private constructor(input: {
    id: number;
    name: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.id = input.id;
    this.name = input.name;
  }

  static create(input: { name: string }, createdBy: number): GradeDomain {
    return new GradeDomain({
      id: -1,
      ...input,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): GradeDomain {
    return new GradeDomain(input);
  }
}
