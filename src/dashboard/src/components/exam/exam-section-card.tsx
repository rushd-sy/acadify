import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { ExamSectionDto } from 'dtos';
import { getSectionStatus } from '@/utils/exam-status.util';

type ExamSectionCardProps = {
  section: ExamSectionDto;
};

export function ExamSectionCard({ section }: ExamSectionCardProps) {
  const status = getSectionStatus(section.startAt, section.duration);
  const startDate = new Date(section.startAt);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-gray-300 transition-all hover:shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <Link
            to={`/sections/${section.sectionId}`}
            className="font-bold text-gray-900 hover:text-primary transition-colors text-base"
          >
            {section.sectionName ?? `Section #${section.sectionId}`}
          </Link>
          <span className="text-xs text-gray-500 font-medium">
            {section.gradeId ? `Grade ${section.gradeId}` : '—'}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Academic Year: {section.academicYear ?? '—'}
        </p>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-400">Start Time:</span>
            <span className="font-semibold text-gray-900">
              {startDate.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              •{' '}
              {startDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration:</span>
            <span className="font-semibold text-gray-900">
              {section.duration} mins
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
            >
              <span
                className={`size-1.5 rounded-full ${status.dotClassName}`}
              />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3 text-right">
        <Link
          to={`/sections/${section.sectionId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Details
          <ExternalLink className="size-3" />
        </Link>
      </div>
    </div>
  );
}
