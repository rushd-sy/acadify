import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sectionService } from '@/services/section.service';
import type { CreateSectionDto, SectionDto } from 'dtos';
import { getApiErrorMessage } from '@/lib/api-error.util';

type SectionFormProps = {
  onCancel: () => void;
  onSuccess: (section: SectionDto) => void;
  section?: SectionDto;
};

export function SectionForm({
  onCancel,
  onSuccess,
  section,
}: SectionFormProps) {
  const [formData, setFormData] = useState<CreateSectionDto>({
    name: section?.name ?? '',
    academicYear: section?.academicYear ?? '',
    gradeId: section?.gradeId ?? 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let updatedSection: SectionDto;

      if (section) {
        updatedSection = await sectionService.updateSection(
          section.id,
          formData,
        );
      } else {
        updatedSection = await sectionService.createSection(formData);
      }

      onSuccess(updatedSection);
    } catch (error) {
      const message = getApiErrorMessage(error);

      setError(
        message ??
          (section
            ? 'Failed to update section. Please try again later.'
            : 'Failed to create section. Please try again later.'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Section Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Section A"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="academicYear">Academic Year</Label>
        <Input
          id="academicYear"
          value={formData.academicYear}
          onChange={(e) =>
            setFormData({ ...formData, academicYear: e.target.value })
          }
          placeholder="e.g. 2026-2027"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gradeId">Grade ID</Label>
        <Input
          id="gradeId"
          type="number"
          value={formData.gradeId || ''}
          onChange={(e) =>
            setFormData({ ...formData, gradeId: parseInt(e.target.value) || 0 })
          }
          placeholder="Enter Grade ID"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? section
              ? 'Updating...'
              : 'Creating...'
            : section
              ? 'Update'
              : 'Create'}
        </Button>
      </div>
    </form>
  );
}
