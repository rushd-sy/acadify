import { api } from '../lib/api-client';

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
}
export const studentService = new StudentServic();
