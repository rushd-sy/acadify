/**
 Builds the Prisma update payload when soft-deleting a User record.
 Suffixes unique contact fields so archived users do not block creating new accounts with the same email or phone number.
 */
export function buildArchivedUserData(
  user: { id: number; email: string; phoneNumber: string },
  archivedAt: Date,
  actionById: number,
) {
  const archiveSuffix = `__archived_${user.id}_${archivedAt.getTime()}`;

  return {
    email: `${user.email}${archiveSuffix}`,
    phoneNumber: `${user.phoneNumber}${archiveSuffix}`,
    archivedAt,
    updatedBy: actionById,
  };
}
