export type SectionStatus = {
  label: 'Upcoming' | 'In Progress' | 'Completed' | 'Scheduled';
  className: string;
  dotClassName: string;
};

/**
 * Calculates the current status of an assigned exam section relative to current wall-clock time.
 *
 * @param startAt - Scheduled start time as a Date object or ISO date string
 * @param durationMinutes - Exam duration in minutes (defaults to 0)
 *
 * Note on staleness:
 * The status is calculated at evaluation/render time. In a long-lived SPA page,
 * a section whose start time passes while the page is open will not automatically
 * flip from "Upcoming" to "In Progress" until the next re-render. If live
 * status updating without user interaction is needed in the future, a periodic interval
 * (timer tick) or WebSocket event can trigger re-evaluation.
 */
export function getSectionStatus(
  startAt: Date | string,
  durationMinutes: number = 0,
): SectionStatus {
  const startTime =
    startAt instanceof Date ? startAt.getTime() : new Date(startAt).getTime();

  if (isNaN(startTime)) {
    return {
      label: 'Scheduled',
      className: 'bg-gray-100 text-gray-600 border border-gray-200',
      dotClassName: 'bg-gray-400',
    };
  }

  const now = Date.now();
  const endTime = startTime + durationMinutes * 60 * 1000;

  if (now < startTime) {
    return {
      label: 'Upcoming',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotClassName: 'bg-emerald-500',
    };
  }

  if (now >= startTime && now <= endTime) {
    return {
      label: 'In Progress',
      className: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClassName: 'bg-amber-500',
    };
  }

  return {
    label: 'Completed',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
    dotClassName: 'bg-gray-400',
  };
}
