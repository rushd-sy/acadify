export abstract class TraceableDomain {
  createdBy?: number;
  createdAt: Date;
  updatedBy?: number;
  updatedAt: Date;
  archivedAt?: Date;

  constructor(input: {
    createdBy?: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt: Date;
    archivedAt?: Date;
  }) {
    this.createdBy = input.createdBy ?? undefined;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedBy = input.updatedBy ?? undefined;
    this.updatedAt = input.updatedAt ?? new Date();
    this.archivedAt = input.archivedAt ?? undefined;
  }
}
