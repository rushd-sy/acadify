import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { studentService } from '@/services/student.service';

type StudentUpdateFormProps = {
  onCancel: () => void;
  studentId: string | null;
};

export function StudentUpdateForm({
  onCancel,
  studentId,
}: StudentUpdateFormProps) {
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!studentId) {
          return;
        }

        studentService
          .updateStudentById(studentId, studentData)
          .then(() => {
            onCancel();
          })
          .catch((error) => {
            console.log('Failed to update student:', error);
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

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
