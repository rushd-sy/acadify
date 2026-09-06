import { api } from '../lib/api-client';
import type { StudentDto, UpdateStudentDto } from 'dtos';

class StudentService {
  private readonly baseUrl = '/api/student';

  async getAllStudents(): Promise<StudentDto[]> {
    const response = await api.get(this.baseUrl);
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.students)) {
      return data.students;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    console.error('Unexpected students response:', data);
    return [];
  }

  async getStudentById(id: number) {
    const response = await api.get(`${this.baseUrl}/${id}`);
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
}

export const studentService = new StudentService();
