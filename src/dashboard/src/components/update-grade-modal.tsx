import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { gradeService } from '@/services/grade.service';
import type { GradeDto } from 'dtos';

type UpdateGradeModalProps = {
  open: boolean;
  grade: GradeDto | null;
  onClose: () => void;
  onUpdated: (grade: GradeDto) => void;
};

export default function UpdateGradeModal({
  open,
  grade,
  onClose,
  onUpdated,
}: UpdateGradeModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const shouldReturn = !open || !grade;

  if (shouldReturn) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Grade name is required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const updatedGrade = await gradeService.updateGrade(grade.id, {
        name: trimmedName,
      });

      onUpdated(updatedGrade);
      onClose();
    } catch (requestError) {
      console.error('Failed to update grade:', requestError);
      setError('Failed to update grade. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">Edit Grade</h2>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-grade-name">Grade Name</FieldLabel>

              <Input
                id="edit-grade-name"
                value={name || grade.name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                placeholder="10th Grade"
                disabled={isSaving}
                aria-invalid={Boolean(error)}
              />

              <FieldError>{error}</FieldError>
            </Field>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Spinner /> : 'Save Changes'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
