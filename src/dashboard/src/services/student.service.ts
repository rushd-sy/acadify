import { apiClient } from '../lib/api-client';
class StudentServic {
  private readonly baseUrl = '/api/student';
  async getAllStudents() {
    const response = await apiClient(this.baseUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }

    return response.json();
  }

  async getStudentById(id: number) {
    const response = await apiClient(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }

    return response.json();
  }

  async deleteStudentById(id: number) {
    const response = await apiClient(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  }
}
export const studentService = new StudentServic();
