export class ExamDomain {
  UniqueID: number;
  examTemplateId: number | null;
  title: string;
  date: Date;

  private constructor(input: {
    UniqueID: number;
    examTemplateId: number | null;
    title: string;
    date: Date;
  }) {
    this.UniqueID = input.UniqueID;
    this.examTemplateId = input.examTemplateId;
    this.title = input.title;
    this.date = input.date;
  }

  static fromPersistence(input: {
    UniqueID: number;
    examTemplateId: number | null;
    title: string;
    date: Date;
  }): ExamDomain {
    return new ExamDomain(input);
  }
}
