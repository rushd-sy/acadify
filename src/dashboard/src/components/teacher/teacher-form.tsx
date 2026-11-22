import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { teacherService } from '@/services/teacher.service';
import { useActionState, useRef } from 'react';
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
import { useFocusFirstError } from '@/hooks/use-focus-first-error';

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
  useFocusFirstError(formRef, state.fieldErrors);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter teacher first name"
              defaultValue={state.values?.firstName ?? teacher?.firstName}
              aria-invalid={!!state.fieldErrors.firstName}
            />
            <FieldError>{state.fieldErrors.firstName}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter teacher last name"
              defaultValue={state.values?.lastName ?? teacher?.lastName}
              aria-invalid={!!state.fieldErrors.lastName}
            />
            <FieldError>{state.fieldErrors.lastName}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldDescription>
            The primary email used for academic notifications.
          </FieldDescription>
          <Input
            id="email"
            name="email"
            placeholder="test@gmail.com"
            defaultValue={state.values?.email ?? teacher?.email}
            aria-invalid={!!state.fieldErrors.email}
          />
          <FieldError>{state.fieldErrors.email}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <FieldDescription>
            Include country code if applicable.
          </FieldDescription>
          <Input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="+963-xxx-xxx-xxx"
            defaultValue={state.values?.phoneNumber ?? teacher?.phoneNumber}
            aria-invalid={!!state.fieldErrors.phoneNumber}
          />
          <FieldError>{state.fieldErrors.phoneNumber}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="degree">Degree</FieldLabel>
          <FieldDescription>
            The degree or qualification of the teacher.
          </FieldDescription>
          <Input
            id="degree"
            name="degree"
            placeholder="Bachelor's in Computer Science"
            defaultValue={state.values?.degree ?? teacher?.degree}
            aria-invalid={!!state.fieldErrors.degree}
          />
          <FieldError>{state.fieldErrors.degree}</FieldError>
        </Field>

        {!teacher && (
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              defaultValue={state.values?.password ?? ''}
              aria-invalid={!!state.fieldErrors.password}
            />
            <FieldError>{state.fieldErrors.password}</FieldError>
          </Field>
        )}
        {state.formError && <FieldError>{state.formError}</FieldError>}
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
