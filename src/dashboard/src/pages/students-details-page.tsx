import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

export default function StudentsDetailsPage() {
  const student = useLocation().state.student;
  console.log(student.name);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card className="mt-32  w-[90%] h-[700px] max-w-full shadow-xl bg-white  ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl text-black mb-32 ml-4 mt-4">
            {student.name} {student.secondName}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-2xl mb-8 ml-16">
            <span>{student.email}</span>
          </div>

          <div className="flex items-center gap-3 text-2xl ml-16">
            <span>{student.number}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
