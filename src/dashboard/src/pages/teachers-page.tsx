import { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { teacherService } from '@/services/teacher.service';
import type { TeacherDto } from 'dtos';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await teacherService.getAllTeachers();

        setTeachers(data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setTeachers([]);
        setFetchError('Failed to load teachers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            A list of registered teachers.
          </TableCaption>

          <TableHeader>
            <TableRow className="text-base">
              <TableHead className="py-5">Name</TableHead>
              <TableHead className="py-5">Email</TableHead>
              <TableHead className="py-5">Degree</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-base">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  Loading teachers...
                </TableCell>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-red-600"
                >
                  {fetchError}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  No teachers available.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.userId} className="h-16">
                  <TableCell className="font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </TableCell>

                  <TableCell>{teacher.email}</TableCell>

                  <TableCell>{teacher.degree}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
