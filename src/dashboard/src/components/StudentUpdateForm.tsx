import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { studentService } from '@/services/student.service';
import type { StudentDetailsDto } from 'dtos/dist/src/student/student-details.dto';
import axios from 'axios';

type StudentUpdateFormProps = {
  onCancel: () => void;
  studentId?: string;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
};

export function StudentUpdateForm({
  onCancel,
  studentId,
  student,
  onUpdateSuccess,
}: StudentUpdateFormProps) {
  const [studentData, setStudentData] = useState({
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    email: student?.email ?? '',
    phoneNumber: student?.phoneNumber ?? '',
  });

  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!studentId) {
          return;
        }

        setUpdateError(null);
        setIsUpdating(true);
        studentService
          .updateStudentById(studentId, studentData)
          .then((updatedStudent) => {
            setIsUpdating(false);
            onUpdateSuccess(updatedStudent);
            onCancel();
          })
          .catch((error) => {
            setIsUpdating(false);
            console.log('Failed to update student:', error);
            if (axios.isAxiosError(error)) {
              const message = error.response?.data?.message;
              if (Array.isArray(message)) {
                setUpdateError(message.join(', '));
                return;
              }

              if (typeof message === 'string') {
                setUpdateError(message);
                return;
              }
            }
            setUpdateError('Failed to update student. Please try again later.');
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
            Include country code if appilcable.
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

        {updateError && <p className="text-sm text-red-600">{updateError}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
