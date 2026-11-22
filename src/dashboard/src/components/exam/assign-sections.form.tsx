import { useEffect, useState } from 'react';
import type { SectionDto } from 'dtos';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { sectionService } from '@/services/section.service';
import { examService } from '@/services/exam.service';
import { getApiErrorMessage } from '../../lib/api-error.util';

type AssignSectionsFormProps = {
  examId: number;
  onCancel: () => void;
  onAssignSuccess: () => void;
};

type SelectedSection = {
  sectionId: number;
  startAt: string;
  duration: number | '';
};

export function AssignSectionsForm({
  examId,
  onCancel,
  onAssignSuccess,
}: AssignSectionsFormProps) {
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [selectedSections, setSelectedSections] = useState<SelectedSection[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSections = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const allSections = await sectionService.getAllSections();
        const assignedSections = await examService.getAssignedSections(examId);

        const assignedIds = new Set(
          assignedSections.map((section) => section.sectionId),
        );

        if (isMounted) {
          setSections(
            allSections.filter((section) => !assignedIds.has(section.id)),
          );
        }
      } catch (error: unknown) {
        if (isMounted) {
          setError(getApiErrorMessage(error) ?? 'Failed to load sections.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchSections();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  const handleSectionChange = (sectionId: number, checked: boolean): void => {
    setSelectedSections((previous) =>
      checked
        ? [...previous, { sectionId, startAt: '', duration: '' }]
        : previous.filter((section) => section.sectionId !== sectionId),
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError(null);

    if (selectedSections.length === 0) {
      setError('Please select at least one section.');
      return;
    }

    const isInvalid = selectedSections.some(
      (section) =>
        !section.startAt ||
        typeof section.duration !== 'number' ||
        !Number.isInteger(section.duration) ||
        section.duration <= 0,
    );

    if (isInvalid) {
      setError(
        'Please provide a valid start time and duration for each section.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await examService.assignSections(examId, {
        sections: selectedSections.map((section) => ({
          sectionId: section.sectionId,
          startAt: new Date(section.startAt).toISOString(),
          duration: section.duration as number,
        })),
      });

      onAssignSuccess();
    } catch (error: unknown) {
      setError(getApiErrorMessage(error) ?? 'Failed to assign sections.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isLoading ? (
        <p>Loading sections...</p>
      ) : error && sections.length === 0 ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : sections.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No available sections to assign.
        </p>
      ) : (
        <FieldGroup>
          <Field>
            <FieldLabel>
              Select Sections ({selectedSections.length} selected)
            </FieldLabel>

            <div className="flex flex-col gap-3">
              {sections.map((section) => {
                const selected = selectedSections.find(
                  (item) => item.sectionId === section.id,
                );

                return (
                  <div key={section.id} className="rounded-md border p-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <Checkbox
                        checked={!!selected}
                        onCheckedChange={(checked) =>
                          handleSectionChange(section.id, checked === true)
                        }
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {section.name} - Grade {section.gradeId}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {section.academicYear}
                        </span>
                      </div>
                    </label>

                    {selected && (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <Field>
                          <FieldLabel>Start At</FieldLabel>
                          <Input
                            type="datetime-local"
                            value={selected.startAt}
                            onChange={(event) =>
                              setSelectedSections((previous) =>
                                previous.map((item) =>
                                  item.sectionId === section.id
                                    ? { ...item, startAt: event.target.value }
                                    : item,
                                ),
                              )
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel>Duration (minutes)</FieldLabel>
                          <Input
                            type="number"
                            min={1}
                            value={selected.duration}
                            onChange={(event) =>
                              setSelectedSections((previous) =>
                                previous.map((item) =>
                                  item.sectionId === section.id
                                    ? {
                                        ...item,
                                        duration:
                                          event.target.value === ''
                                            ? ''
                                            : Number(event.target.value),
                                      }
                                    : item,
                                ),
                              )
                            }
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Field>
        </FieldGroup>
      )}

      {error && sections.length > 0 && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isLoading ||
            isSubmitting ||
            sections.length === 0 ||
            selectedSections.length === 0
          }
        >
          {isSubmitting ? 'Assigning...' : 'Assign Sections'}
        </Button>
      </DialogFooter>
    </form>
  );
}
