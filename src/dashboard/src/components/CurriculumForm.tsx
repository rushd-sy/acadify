import { Field, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>
            Curriculum Name
            <Input
              required
              placeholder="e.g. Computer Science"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Description
            <Input
              required
              placeholder="Brief description of the curriculum"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
