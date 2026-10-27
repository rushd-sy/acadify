import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { gradeService } from '@/services/grade.service';
import type { GradeDto } from 'dtos';
import { DialogFooter } from '@/components/ui/dialog';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';

type GradeFormProps = {
  onCancel: () => void;
  onUpdateSuccess: (updatedGrade: GradeDto) => void;
  onCreateSuccess: (createdGrade: GradeDto) => void;
  grade?: GradeDto;
};

type GradeFormData = {
  name: string;
};

const gradeFormFields = ['name'];

type GradeFormState = FormState<GradeFormData>;

const initialFormState = createInitialFormState<GradeFormData>();

export function GradeForm({
  onCancel,
  onUpdateSuccess,
  onCreateSuccess,
  grade,
}: GradeFormProps) {
  const validateGradeForm = (data: GradeFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = 'Grade name is required.';
    return errors;
  };

  const gradeAction = async (
    _prevState: GradeFormState,
    formData: FormData,
  ): Promise<GradeFormState> => {
    const gradeData: GradeFormData = {
      name: getFormString(formData, 'name'),
    };

    const validationErrors = validateGradeForm(gradeData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: gradeData,
      };
    }

    try {
      if (grade) {
        const updateGrade = await gradeService.updateGrade(grade.id, gradeData);

        onUpdateSuccess(updateGrade);
      } else {
        const createGrade = await gradeService.createGrade(gradeData);
        onCreateSuccess(createGrade);
      }

      onCancel();

      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save grade:', error);

      const apiFieldErrors = getApiValidationErrors(error, gradeFormFields);
      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: gradeData,
        };
      }

      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${grade ? 'update' : 'create'} grade. Please try again later.`,
        values: gradeData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    gradeAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Grade Name</FieldLabel>
          <Input
            placeholder="e.g. 1st Grade"
            name="name"
            defaultValue={state.values?.name ?? grade?.name}
          />
          {state.fieldErrors.name && (
            <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
          )}
        </Field>

        {state.formError && (
          <p className="text-sm text-red-600">{state.formError}</p>
        )}
      </FieldGroup>

      <DialogFooter className="pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="text-black" /> : 'Submit'}
        </Button>
      </DialogFooter>
    </form>
  );
}
