import { api } from '../lib/api-client';
import type {
  StudentDetailsDto,
  CreateStudentDto,
  StudentDto,
  UpdateStudentDto,
} from 'dtos';

class StudentService {
  private readonly baseUrl = '/api/student';

  async getAllStudents(): Promise<StudentDto[]> {
    const response = await api.get<StudentDto[]>(this.baseUrl);
    return response.data;
  }

  async getStudentById(id: number): Promise<StudentDetailsDto> {
    const response = await api.get<StudentDetailsDto>(`${this.baseUrl}/${id}`);

    return response.data;
  }

  async deleteStudentById(id: number | string) {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateStudentById(
    id: number | string,
    updatedStudent: UpdateStudentDto,
  ) {
    const response = await api.put(`${this.baseUrl}/${id}`, updatedStudent);

    return response.data;
  }

  async createStudent(data: CreateStudentDto): Promise<StudentDetailsDto> {
    const response = await api.post<StudentDetailsDto>(this.baseUrl, data);
    return response.data;
  }
}

export const studentService = new StudentService();
