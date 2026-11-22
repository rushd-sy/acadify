import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '../ui/dialog';

type CurriculumFormProps = {
  onCancel: () => void;
  onUpdateSuccess: (updatedCurriculum: CurriculumDto) => void;
  onCreateSuccess: (createdCurriculum: CurriculumDto) => void;
  curriculum?: CurriculumDto;
};

type CurriculumFormData = {
  name: string;
  description: string;
};

const curriculumFormFields = ['name', 'description'];

type CurriculumFormState = FormState<CurriculumFormData>;

const initialFormState = createInitialFormState<CurriculumFormData>();

export function CurriculumForm({
  onCancel,
  onUpdateSuccess,
  onCreateSuccess,
  curriculum,
}: CurriculumFormProps) {
  const validateCurriculumForm = (data: CurriculumFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = 'Curriculum name is required.';
    return errors;
  };

  const curriculumAction = async (
    _prevState: CurriculumFormState,
    formData: FormData,
  ): Promise<CurriculumFormState> => {
    const curriculumData: CurriculumFormData = {
      name: getFormString(formData, 'name'),
      description: getFormString(formData, 'description'),
    };
    const validationErrors = validateCurriculumForm(curriculumData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: curriculumData,
      };
    }

    try {
      if (curriculum) {
        const updateCurriculum = await curriculumService.updateCurriculumById(
          curriculum.id,
          curriculumData,
        );

        onUpdateSuccess(updateCurriculum);
      } else {
        const createCurriculum =
          await curriculumService.createCurriculum(curriculumData);

        onCreateSuccess(createCurriculum);
      }

      onCancel();

      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save curriculum', error);

      const apiFieldErrors = getApiValidationErrors(
        error,
        curriculumFormFields,
      );
      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: curriculumData,
        };
      }

      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${curriculum ? 'update' : 'create'} curriculum. Please try again later.`,
        values: curriculumData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    curriculumAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Curriculum Name</FieldLabel>
          <Input
            id="name"
            placeholder="e.g. Computer Science"
            name="name"
            defaultValue={state.values?.name ?? curriculum?.name}
          />
          {state.fieldErrors.name && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.name}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Brief description of the curriculum"
            name="description"
            rows={3}
            defaultValue={state.values?.description ?? curriculum?.description}
          />
          {state.fieldErrors.description && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.description}
            </p>
          )}
        </Field>

        {state.formError && (
          <p className="text-xs text-red-600 leading-tight">
            {state.formError}
          </p>
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
