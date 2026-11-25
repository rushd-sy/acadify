import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import type { StudentDetailsDto } from 'dtos';
import { studentService } from '@/services/student.service';
import { useActionState, useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';
import { emailRegex, phoneRegex } from '@/forms/validation.util';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';
import { DialogFooter } from '@/components/ui/dialog';
import { useFocusFirstError } from '@/hooks/use-focus-first-error';

type StudentFormProps = {
  onCancel: () => void;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onCreateSuccess: (createdStudent: StudentDetailsDto) => void;
};

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const studentFormFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'password',
];

type StudentFormState = FormState<StudentFormData>;

const initialFormState = createInitialFormState<StudentFormData>();

export function StudentForm({
  onCancel,
  student,
  onUpdateSuccess,
  onCreateSuccess,
}: StudentFormProps) {
  const validateStudentForm = (data: StudentFormData) => {
    const errors: Record<string, string> = {};
    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
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
    if (!student && !data.password.trim()) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const studentAction = async (
    _prevState: StudentFormState,
    formData: FormData,
  ): Promise<StudentFormState> => {
    const studentData = {
      firstName: getFormString(formData, 'firstName'),
      lastName: getFormString(formData, 'lastName'),
      email: getFormString(formData, 'email'),
      phoneNumber: getFormString(formData, 'phoneNumber'),
      password: getFormString(formData, 'password'),
    };
    const validationErrors = validateStudentForm(studentData);

    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        fieldErrors: validationErrors,
        formError: null,
        values: studentData,
      };
    }

    try {
      if (student) {
        const { password, ...useActionState } = studentData;
        void password;

        const updatedStudent = await studentService.updateStudentById(
          student.userId,
          useActionState,
        );
        onUpdateSuccess(updatedStudent);
      } else {
        const { password, ...rest } = studentData;
        const createdStudent = await studentService.createStudent({
          ...rest,
          hashedPassword: password,
        });
        onCreateSuccess(createdStudent);
      }

      onCancel();
      return { success: true, fieldErrors: {}, formError: null };
    } catch (error) {
      console.error('Failed to save student:', error);

      const apiFieldErrors = getApiValidationErrors(error, studentFormFields);

      if (Object.keys(apiFieldErrors).length > 0) {
        return {
          success: false,
          fieldErrors: apiFieldErrors,
          formError: null,
          values: studentData,
        };
      }

      return {
        success: false,
        fieldErrors: {},
        formError:
          getApiErrorMessage(error) ??
          `Failed to ${student ? 'update' : 'create'} student. Please try again later.`,
        values: studentData,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    studentAction,
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
              placeholder="Enter student first name"
              defaultValue={state.values?.firstName ?? student?.firstName ?? ''}
              aria-invalid={!!state.fieldErrors.firstName}
            />
            <FieldError>{state.fieldErrors.firstName}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter student last name"
              defaultValue={state.values?.lastName ?? student?.lastName ?? ''}
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
            defaultValue={state.values?.email ?? student?.email ?? ''}
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
            defaultValue={
              state.values?.phoneNumber ?? student?.phoneNumber ?? ''
            }
            aria-invalid={!!state.fieldErrors.phoneNumber}
          />
          <FieldError>{state.fieldErrors.phoneNumber}</FieldError>
        </Field>

        {!student && (
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
