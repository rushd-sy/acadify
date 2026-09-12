export class CurriculumDomain {
  id?: number;
  name!: string;
  description!: string;

  private constructor(input: {
    id?: number;
    name: string;
    description: string;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
  }

  static create(input: {
    name: string;
    description: string;
  }): CurriculumDomain {
    return new CurriculumDomain(input);
  }

  static fromPersistence(input: {
    id: number;
    name: string;
    description: string;
  }): CurriculumDomain {
    return new CurriculumDomain(input);
  }
}
