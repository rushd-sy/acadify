export abstract class TraceableDomain {
  createdBy: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt?: Date;
  archivedAt?: Date;

  constructor(input: {
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    this.createdBy = input.createdBy ?? new Date();
    this.createdAt = input.createdAt ?? new Date();
    this.updatedBy = input.updatedBy ?? undefined;
    this.updatedAt = input.updatedAt ?? undefined;
    this.archivedAt = input.archivedAt ?? undefined;
  }
}
