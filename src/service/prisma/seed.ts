import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const main = async () => {
  const prisma = new PrismaClient();

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Student" RESTART IDENTITY;`,
    );

    for (let i = 0; i < 10; i++) {
      await prisma.student.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phoneNumber: faker.phone.number(),
          email: faker.internet.email(),
        },
      });
    }

    console.log('Seed completed');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void main();
