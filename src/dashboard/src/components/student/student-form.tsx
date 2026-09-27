import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import type { StudentDetailsDto } from 'dtos';
import { studentService } from '@/services/student.service';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getApiErrorMessage } from '@/lib/api-error.util';

type StudentFormProps = {
  onCancel: () => void;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onCreateSuccess: (createdStudent: StudentDetailsDto) => void;
};

export function StudentForm({
  onCancel,
  student,
  onUpdateSuccess,
  onCreateSuccess,
}: StudentFormProps) {
  const [studentData, setStudentData] = useState({
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    email: student?.email ?? '',
    phoneNumber: student?.phoneNumber ?? '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        setFormError(null);
        setIsSubmitting(true);

        if (student) {
          studentService
            .updateStudentById(student.userId, studentData)
            .then((updatedStudent) => {
              setIsSubmitting(false);
              onUpdateSuccess(updatedStudent);
              onCancel();
            })
            .catch((error) => {
              setIsSubmitting(false);
              console.log('Failed to update student:', error);
              const message = getApiErrorMessage(error);
              setFormError(
                message ?? 'Failed to update student. Please try again later.',
              );
            });

          return;
        }

        studentService
          .createStudent({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            phoneNumber: studentData.phoneNumber,
            hashedPassword: studentData.password,
          })
          .then((createdStudent) => {
            setIsSubmitting(false);
            onCreateSuccess(createdStudent);
            onCancel();
          })
          .catch((error) => {
            setIsSubmitting(false);
            console.log('Failed to create student:', error);
            const message = getApiErrorMessage(error);
            setFormError(
              message ?? 'Failed to create student. Please try again later.',
            );
          });
      }}
    >
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel>
            First Name
            <Input
              className="firstName"
              placeholder="Mohammad"
              value={studentData.firstName}
              onChange={(data) =>
                setStudentData({ ...studentData, firstName: data.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Last Name
            <Input
              className="lastName"
              placeholder="Arrata"
              value={studentData.lastName}
              onChange={(data) =>
                setStudentData({ ...studentData, lastName: data.target.value })
              }
            />
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel>
            Email
            <Input
              className="email"
              placeholder="mohammadarrata@gmail.com"
              value={studentData.email}
              onChange={(data) =>
                setStudentData({ ...studentData, email: data.target.value })
              }
            />
            <FieldDescription>
              The primary email used for academic notifications.
            </FieldDescription>
          </FieldLabel>
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
            value={studentData.phoneNumber}
            onChange={(data) =>
              setStudentData({ ...studentData, phoneNumber: data.target.value })
            }
          />
        </Field>

        {!student && (
          <Field>
            <FieldLabel>
              Password
              <Input
                type="password"
                placeholder="Enter password"
                value={studentData.password}
                onChange={(data) =>
                  setStudentData({
                    ...studentData,
                    password: data.target.value,
                  })
                }
              />
            </FieldLabel>
          </Field>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
