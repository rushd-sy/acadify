import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { teacherService } from '@/services/teacher.service';
import { useActionState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { emailRegex, phoneRegex } from '@/forms/validation.util';
import { Spinner } from '../ui/spinner';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '../ui/dialog';

type TeacherFormProps = {
  onCancel: () => void;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
};

type TeacherFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  degree: string;
  password: string;
};

const teacherFormFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
  'degree',
];

type TeacherFormState = FormState<TeacherFormData>;

const initialFormState = createInitialFormState<TeacherFormData>();

export function TeacherForm({
  onCancel,
  teacher,
  onUpdateSuccess,
  onCreateSuccess,
}: TeacherFormProps) {
  const validateTeacherForm = (data: TeacherFormData) => {
    const errors: Record<string, string> = {};
    if (!data.firstName.trim()) errors.firstName = 'First name is required.';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!data.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!phoneRegex.test(data.phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid phone number.';
    }
    if (!data.degree.trim()) errors.degree = 'Degree is required.';
    if (!teacher && !data.password.trim())
      errors.password = 'Password is required.';
    return errors;
  };

  const teacherAction = async (
    _prevState: TeacherFormState,
    formData: FormData,
  ): Promise<TeacherFormState> => {
    const teacherData: TeacherFormData = {
      firstName: getFormString(formData, 'firstName'),
      lastName: getFormString(formData, 'lastName'),
      email: getFormString(formData, 'email'),
      phoneNumber: getFormString(formData, 'phoneNumber'),
      degree: getFormString(formData, 'degree'),
      password: getFormString(formData, 'password'),
    };

    const validationErrors = validateTeacherForm(teacherData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: teacherData,
      };
    }

    try {
      if (teacher) {
        const { password, ...updateData } = teacherData;
        void password;

        const updatedTeacher = await teacherService.updateTeacherById(
          teacher.userId,
          updateData,
        );

        onUpdateSuccess(updatedTeacher);
      } else {
        const { password, ...rest } = teacherData;
        const createdTeacher = await teacherService.createTeacher({
          ...rest,
          hashedPassword: password,
        });
        onCreateSuccess(createdTeacher);
      }

      onCancel();
      return { success: true, fieldErrors: {}, formError: null };
    } catch (error: unknown) {
      console.error('Failed to save teacher:', error);

      const apiFieldErrors = getApiValidationErrors(error, teacherFormFields);

      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: teacherData,
        };
      }

      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${teacher ? 'update' : 'create'} teacher. Please try again later.`,
        values: teacherData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    teacherAction,
    initialFormState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.fieldErrors && Object.keys(state.fieldErrors).length > 0) {
      const firstFieldName = Object.keys(state.fieldErrors)[0];
      const element = formRef.current?.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${firstFieldName}"]`);
      element?.focus();
    }
  }, [state.fieldErrors]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input
              name="firstName"
              placeholder="Enter teacher first name"
              defaultValue={state.values?.firstName ?? teacher?.firstName}
              aria-invalid={!!state.fieldErrors.firstName}
            />
            {state.fieldErrors.firstName && (
              <p className="text-xs text-red-600 leading-tight">
                {state.fieldErrors.firstName}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input
              name="lastName"
              placeholder="Enter teacher last name"
              defaultValue={state.values?.lastName ?? teacher?.lastName}
              aria-invalid={!!state.fieldErrors.lastName}
            />
            {state.fieldErrors.lastName && (
              <p className="text-xs text-red-600 leading-tight">
                {state.fieldErrors.lastName}
              </p>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>
            The primary email used for academic notifications.
          </FieldDescription>
          <Input
            name="email"
            placeholder="test@gmail.com"
            defaultValue={state.values?.email ?? teacher?.email}
            aria-invalid={!!state.fieldErrors.email}
          />
          {state.fieldErrors.email && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.email}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <FieldDescription>
            Include country code if applicable.
          </FieldDescription>
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="+963-xxx-xxx-xxx"
            defaultValue={state.values?.phoneNumber ?? teacher?.phoneNumber}
            aria-invalid={!!state.fieldErrors.phoneNumber}
          />
          {state.fieldErrors.phoneNumber && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.phoneNumber}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Degree</FieldLabel>
          <FieldDescription>
            The degree or qualification of the teacher.
          </FieldDescription>
          <Input
            name="degree"
            placeholder="Bachelor's in Computer Science"
            defaultValue={state.values?.degree ?? teacher?.degree}
            aria-invalid={!!state.fieldErrors.degree}
          />
          {state.fieldErrors.degree && (
            <p className="text-xs text-red-600 leading-tight">
              {state.fieldErrors.degree}
            </p>
          )}
        </Field>

        {!teacher && (
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              defaultValue={state.values?.password ?? ''}
              aria-invalid={!!state.fieldErrors.password}
            />
            {state.fieldErrors.password && (
              <p className="text-xs text-red-600 leading-tight">
                {state.fieldErrors.password}
              </p>
            )}
          </Field>
        )}
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
