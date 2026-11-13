-- Archived users must not block reuse of their email / phone number.
-- Prisma cannot express partial unique indexes, so uniqueness is enforced here.
DROP INDEX "User_email_key";
DROP INDEX "User_phoneNumber_key";

CREATE UNIQUE INDEX "User_email_active_key" ON "User"("email") WHERE "archivedAt" IS NULL;
CREATE UNIQUE INDEX "User_phoneNumber_active_key" ON "User"("phoneNumber") WHERE "archivedAt" IS NULL;
