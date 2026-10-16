import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import SectionModal from '@/components/section/section-modal';
import { sectionService } from '@/services/section.service';
import type { SectionDto } from 'dtos';

const getAvatarStyle = (name: string) => {
  const styles = [
    'bg-blue-100 text-blue-700',
    'bg-rose-100 text-rose-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-amber-100 text-amber-700',
    'bg-cyan-100 text-cyan-700',
  ];
  const index = name.length % styles.length;
  return styles[index];
};

export default function SectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<SectionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    sectionService
      .getSectionById(Number(id))
      .then((data) => {
        if (isMounted) {
          setSection(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch section details:', err);
        if (isMounted) {
          setError('Failed to load section details.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'Section not found'}
      </div>
    );
  }

  const teacherCount = section.teachers?.length || 0;

  return (
    <div className="w-full min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <span
          className="cursor-pointer transition-colors hover:text-slate-900"
          onClick={() => navigate('/home')}
        >
          Dashboard
        </span>
        <span className="text-slate-400">&gt;</span>
        <span
          className="cursor-pointer transition-colors hover:text-slate-900"
          onClick={() => navigate('/sections')}
        >
          My Sections
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="font-semibold text-slate-900">{section.name}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {section.name}
            </h1>
            <p className="text-base text-slate-500">
              Academic Year : {section.academicYear}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            Edit Section
          </Button>
        </div>

        <div className="rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900">
            Teachers ({teacherCount})
          </h2>

          {teacherCount > 0 ? (
            <div className="flex flex-wrap gap-4">
              {section.teachers!.map((teacher, index) => {
                const initials =
                  `${teacher.teacherFirstName[0]}${teacher.teacherLastName[0]}`.toUpperCase();

                return (
                  <div
                    key={`${teacher.teacherId}-${index}`}
                    onClick={() => navigate(`/teachers/${teacher.teacherId}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-white p-2 pr-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarStyle(teacher.teacherFirstName)}`}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {teacher.teacherFirstName} {teacher.teacherLastName}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No teachers assigned to this section yet.
            </p>
          )}
        </div>
      </div>

      <SectionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updatedSection) => {
          setSection(updatedSection);
          setIsEditModalOpen(false);
        }}
        section={section}
      />
    </div>
  );
}
