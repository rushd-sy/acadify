export class GradeDomain {
  id?: number;
  name!: string;

  private constructor(input: { id?: number; name: string }) {
    this.id = input.id;
    this.name = input.name;
  }

  static crete(input: { name: string }): GradeDomain {
    return new GradeDomain(input);
  }

  static fromPersistence(input: { id: number; name: string }): GradeDomain {
    return new GradeDomain(input);
  }
}
