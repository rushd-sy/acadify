class StudentServic {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/student`;
  async getAllStudents() {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }

    return response.json();
  }

  async getStudentById(id: number) {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }

    return response.json();
  }

  async deleteStudentById(id: number) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  }
}
export const studentService = new StudentServic();
