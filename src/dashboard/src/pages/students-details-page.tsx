import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

export default function StudentsDetailsPage() {
  const student = useLocation().state.student;

  return (
    <Card className="mt-20 mx-auto w-[90%] max-w-4xl rounded-3xl shadow-2xl border border-gray-200 bg-white">
      <CardHeader className="pb-8">
        <CardTitle className="text-4xl font-bold text-center text-gray-800">
          Student Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-10 pb-10">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <span className="text-lg font-semibold text-gray-500">
            Student Name
          </span>

          <span className="text-2xl font-bold text-gray-900">
            {student.name} {student.secondName}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <span className="text-lg font-semibold text-gray-500">Email</span>

          <span className="text-xl text-gray-800">{student.email}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-500">
            Phone Number
          </span>

          <span className="text-xl text-gray-800">{student.number}</span>
        </div>
      </CardContent>
    </Card>
  );
}
