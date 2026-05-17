import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const seed = async () => {
  const prisma = new PrismaClient();

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

  console.log('Database seeded');
};

const clear = async () => {
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Student" RESTART IDENTITY CASCADE;`,
  );

  console.log('Database cleared');
};

const main = async () => {
  const prisma = new PrismaClient();
  const action = process.argv[2];

  try {
    switch (action) {
      case 'seed':
        await seed();
        break;

      case 'clear':
        await clear();
        break;

      case 'reset':
        await clear();
        await seed();
        break;

      default:
        console.log('Invalid command');
    }
  } finally {
    await prisma.$disconnect();
  }
};

void main();
