import { Section } from './section.aggregate';

export const SECTION_REPOSITORY = Symbol('SECTION_REPOSITORY');

export interface SectionRepository {
  findById(id: number): Promise<Section | null>;
  findAll(): Promise<Section[]>;
  existsByName(name: string): Promise<boolean>;
  deleteById(id: number): Promise<boolean>;
  save(section: Section): Promise<Section>;
}
