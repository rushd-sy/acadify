import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from './ui/spinner';

type CurriculumFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: CurriculumDto;
};

export function CurriculumForm({
  onCancel,
  onSuccess,
  initialData,
}: CurriculumFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const isEditCase = initialData?.id && initialData.id !== -1;
      if (isEditCase) {
        await curriculumService.updateCurriculumById(initialData.id, formData);
      } else {
        await curriculumService.createCurriculum(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save curriculum:', error);

      const validationErrors = getApiValidationErrors(error, [
        'name',
        'description',
      ]);

      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
      } else {
        const message = getApiErrorMessage(error);

        setFormError(
          message ?? 'Failed to save curriculum. Please try again later.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>Curriculum Name</FieldLabel>
          <Input
            placeholder="e.g. Computer Science"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-600">{fieldErrors.name}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            placeholder="Brief description of the curriculum"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {fieldErrors.description && (
            <p className="text-sm text-red-600">{fieldErrors.description}</p>
          )}
        </Field>

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="text-white" /> : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
