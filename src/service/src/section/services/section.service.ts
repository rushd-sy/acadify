import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SectionRepository } from '../data/section.repository';
import { SectionDtoMapper } from '../mappers/section.dto.mapper';
import { SectionDomainMapper } from '../mappers/section.domain.mapper';
import {
  CreateSectionDto,
  SectionCurriculumTeacherDto,
  SectionDto,
  SectionStudentDto,
  UpdateSectionDto,
} from 'dtos';

@Injectable()
export class SectionService {
  constructor(
    private readonly repository: SectionRepository,
    private readonly dtoMapper: SectionDtoMapper,
    private readonly domainMapper: SectionDomainMapper,
  ) {}

  async getAllSections(): Promise<SectionDto[]> {
    const sections = await this.repository.findAll();
    const assembledData = sections.map((section) => ({
      section,
      teachers: [],
      students: [],
    }));

    return this.dtoMapper.toDtoList(assembledData);
  }

  async findById(id: number): Promise<SectionDto> {
    const sectionDomain = await this.repository.findById(id);

    if (!sectionDomain) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    const rawTeachersList = await this.repository.getTeachersBySectionId(id);
    const rawStudentRecords = await this.repository.getStudentsBySectionId(id);

    const teachersList: SectionCurriculumTeacherDto[] = rawTeachersList.map(
      (teacherData) =>
        this.dtoMapper.toSectionCurriculumTeacherDto(teacherData),
    );

    const studentsList: SectionStudentDto[] = rawStudentRecords.map(
      (studentData) => this.dtoMapper.toSectionStudentDto(studentData),
    );

    return this.dtoMapper.toDto({
      section: sectionDomain,
      teachers: teachersList,
      students: studentsList,
    });
  }

  async createSection(createSection: CreateSectionDto): Promise<SectionDto> {
    const existingSection = await this.repository.existsByName(
      createSection.name,
    );

    if (existingSection) {
      throw new ConflictException(
        `Section with name ${createSection.name} already exists`,
      );
    }

    const sectionDomain =
      this.domainMapper.toDomainFromCreateDto(createSection);

    const createdSection = await this.repository.save(sectionDomain);

    return this.dtoMapper.toDto({
      section: createdSection,
      teachers: [],
      students: [],
    });
  }

  async updateSectionById(
    id: number,
    data: UpdateSectionDto,
  ): Promise<SectionDto> {
    const sectionDomain = await this.repository.findById(id);

    if (!sectionDomain) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    if (data.name) {
      const isNameTaken = await this.repository.existsByName(data.name, id);

      if (isNameTaken) {
        throw new ConflictException(
          `Section with name "${data.name}" already exists`,
        );
      }
      sectionDomain.rename(data.name);
    }

    if (data.academicYear) {
      sectionDomain.changeAcademicYear(data.academicYear);
    }

    const updatedSection = await this.repository.save(sectionDomain);

    return this.dtoMapper.toDto({
      section: updatedSection,
      teachers: [],
      students: [],
    });
  }

  async deleteSection(id: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id);

    if (!isDeleted) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
  }
}
