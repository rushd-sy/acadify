import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 w-full">
      <Card className="w-full max-w-3xl text-center shadow-sm border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome to Acadify 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Your central hub for academic management and tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-gray-100">
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-gray-500">
                Monitor student grades and academic performance effortlessly.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">
                Manage Sections
              </h3>
              <p className="text-sm text-gray-500">
                Organize classes, assign teachers and handle curriculums.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">
                Generate Reports
              </h3>
              <p className="text-sm text-gray-500">
                Export analytics and detailed insights with a few clicks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
