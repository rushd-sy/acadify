import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { sectionService } from '@/services/section.service';
import type { SectionDto } from 'dtos';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';

type SectionFormProps = {
  onCancel: () => void;
  onUpdateSuccess: (updateSection: SectionDto) => void;
  onCreateSuccess: (createSection: SectionDto) => void;
  section?: SectionDto;
};

type SectionFormData = {
  name: string;
  academicYear: string;
  gradeId: number;
};

const sectionFormFields = ['name', 'academicYear', 'gradeId'];

type SectionFormState = FormState<SectionFormData>;

const initialFormState = createInitialFormState<SectionFormData>();

export function SectionForm({
  onCancel,
  onUpdateSuccess,
  onCreateSuccess,
  section,
}: SectionFormProps) {
  const validateSectionForm = (data: SectionFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) {
      errors.name = 'Section name is required.';
    }
    if (!data.academicYear.trim()) {
      errors.academicYear = 'Academic year is required.';
    }
    if (!data.gradeId) {
      errors.gradeId = 'Grade ID is required.';
    } else if (!Number.isInteger(data.gradeId) || data.gradeId <= 0) {
      errors.gradeId = 'Please select a valid Grade ID.';
    }
    return errors;
  };
  const sectionAction = async (
    _prevState: SectionFormState,
    formData: FormData,
  ): Promise<SectionFormState> => {
    const gradeIdValue = getFormString(formData, 'gradeId').trim();
    const gradeId = Number(gradeIdValue);
    const sectionData = {
      name: getFormString(formData, 'name'),
      academicYear: getFormString(formData, 'academicYear'),
      gradeId,
    };

    const validationErrors = validateSectionForm(sectionData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: sectionData,
      };
    }

    try {
      if (section) {
        const updatedSection = await sectionService.updateSection(
          section.id,
          sectionData,
        );

        onUpdateSuccess(updatedSection);
      } else {
        const createdSection = await sectionService.createSection(sectionData);

        onCreateSuccess(createdSection);
      }
      onCancel();

      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save section:', error);
      const apiFieldErrors = getApiValidationErrors(error, sectionFormFields);
      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: sectionData,
        };
      }
      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${section ? 'update' : 'create'} section. Please try again later.`,
        values: sectionData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    sectionAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Section Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Section A"
          defaultValue={state.values?.name ?? section?.name}
        />
        {state.fieldErrors.name && (
          <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="academicYear">Academic Year</Label>
        <Input
          id="academicYear"
          name="academicYear"
          placeholder="e.g. 2026-2027"
          defaultValue={state.values?.academicYear ?? section?.academicYear}
        />
        {state.fieldErrors.academicYear && (
          <p className="text-sm text-red-600">
            {state.fieldErrors.academicYear}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gradeId">Grade ID</Label>
        <Input
          id="gradeId"
          type="number"
          name="gradeId"
          placeholder="Enter Grade ID"
          defaultValue={state.values?.gradeId ?? section?.gradeId}
        />
        {state.fieldErrors.gradeId && (
          <p className="text-sm text-red-600">{state.fieldErrors.gradeId}</p>
        )}
      </div>

      {state.formError && (
        <div className="text-sm text-red-600">{state.formError}</div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="text-black" /> : 'Submit'}
        </Button>
      </div>
    </form>
  );
}
