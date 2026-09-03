import { api } from '../lib/api-client';
import type { UpdateStudentDto } from 'dtos';

class StudentServic {
  private readonly baseUrl = 'api/student';
  async getAllStudents() {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getStudentById(id: number) {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async deleteStudentById(id: number | string) {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateStudentById(id: number | string , updatedStudent: UpdateStudentDto) {
    const response = await api.put(`${this.baseUrl}/${id}`, updatedStudent);
    return response.data;
  }
}
export const studentService = new StudentServic();
