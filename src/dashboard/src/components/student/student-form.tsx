import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import type { StudentDetailsDto } from 'dtos';
import { studentService } from '@/services/student.service';
import { useActionState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from '@/lib/api-error.util';
import { Spinner } from '../ui/spinner';
import { emailRegex } from '@/forms/validation.util';
import { getFormString } from '@/forms/form-data.util';
import { createInitialFormState, type FormState } from '@/forms/state';

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
    if (!data.firstName.trim()) errors.firstName = 'First name is required.';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!data.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!data.phoneNumber.trim())
      errors.phoneNumber = 'Phone number is required.';
    if (!student && !data.password.trim())
      errors.password = 'Password is required.';
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
    } catch (error: unknown) {
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

  return (
    <form action={formAction}>
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input
            name="firstName"
            placeholder="Mohammad"
            defaultValue={state.values?.firstName ?? student?.firstName ?? ''}
          />
          {state.fieldErrors.firstName && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.firstName}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input
            name="lastName"
            placeholder="Arrata"
            defaultValue={state.values?.lastName ?? student?.lastName ?? ''}
          />
          {state.fieldErrors.lastName && (
            <p className="text-sm text-red-600">{state.fieldErrors.lastName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>
            The primary email used for academic notifications.
          </FieldDescription>
          <Input
            name="email"
            placeholder="mohammadarrata@gmail.com"
            defaultValue={state.values?.email ?? student?.email ?? ''}
          />
          {state.fieldErrors.email && (
            <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
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
            placeholder="+963 954 220 986"
            defaultValue={
              state.values?.phoneNumber ?? student?.phoneNumber ?? ''
            }
          />
          {state.fieldErrors.phoneNumber && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.phoneNumber}
            </p>
          )}
        </Field>

        {!student && (
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              defaultValue={state.values?.password ?? ''}
            />
            {state.fieldErrors.password && (
              <p className="text-sm text-red-600">
                {state.fieldErrors.password}
              </p>
            )}
          </Field>
        )}

        {state.formError && (
          <p className="text-sm text-red-600">{state.formError}</p>
        )}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner className="text-black" /> : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
