export async function getAllStudents() {
  const response = await fetch('http://localhost:3000/api/student');

  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }

  return response.json();
}

export async function getStudentById(id: number) {
  const response = await fetch(`http://localhost:3000/api/student/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch student');
  }

  return response.json();
}

export async function deleteStudentById(id: number) {
  const response = await fetch(`http://localhost:3000/api/student/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete student');
  }
}
