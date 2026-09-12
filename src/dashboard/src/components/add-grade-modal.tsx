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

type AddGradeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (grade: GradeDto) => void;
};

export default function AddGradeModal({
  open,
  onClose,
  onCreated,
}: AddGradeModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const resetForm = () => {
    setName('');
    setError(null);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    resetForm();
    onClose();
  };

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

      const grade = await gradeService.createGrade({
        name: trimmedName,
      });

      onCreated(grade);
      resetForm();
      onClose();
    } catch (requestError) {
      console.error('Failed to create grade:', requestError);
      setError('Failed to create grade. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">Add Grade</h2>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="grade-name">Grade Name</FieldLabel>

              <Input
                id="grade-name"
                value={name}
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
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Spinner /> : 'Add Grade'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
