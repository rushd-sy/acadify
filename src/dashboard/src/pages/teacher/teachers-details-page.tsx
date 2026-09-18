import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { teacherService } from '@/services/teacher.service';
import type { TeacherDetailsDto } from 'dtos';

export default function TeachersDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [teacher, setTeacher] = useState<TeacherDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) {
        setFetchError('Teacher ID is missing.');
        setIsLoading(false);
        return;
      }

      const teacherId = Number(id);

      if (!Number.isInteger(teacherId) || teacherId <= 0) {
        setFetchError('Invalid teacher ID.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await teacherService.getTeacherById(teacherId);
        setTeacher(data);
      } catch (error) {
        console.error('Failed to fetch teacher:', error);
        setTeacher(null);
        setFetchError('Failed to load teacher. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return <div className="mt-20 text-center text-2xl">Loading teacher...</div>;
  }

  if (fetchError) {
    return (
      <div className="mt-20 text-center text-2xl text-red-600">
        {fetchError}
      </div>
    );
  }

  if (!teacher) {
    return <div className="mt-20 text-center text-2xl">Teacher Not Found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <Card className="border-0 shadow-none">
        <CardHeader className="border-b bg-white pb-6 px-0">
          <CardTitle className="mx-auto text-2xl font-bold">
            Teacher Details
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-10 px-0">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                First Name
              </span>
              <span className="text-lg font-semibold">{teacher.firstName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Last Name
              </span>
              <span className="text-lg font-semibold">{teacher.lastName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Phone Number
              </span>
              <span className="text-lg font-semibold">
                {teacher.phoneNumber}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-lg font-semibold">{teacher.email}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/50 pt-6">
          //TODO: Use update form here
          <Button variant="secondary">Edit</Button>
          //TODO: use Generic Delete Modal
          <Button variant="secondary">Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
