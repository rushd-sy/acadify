import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Command } from 'commander';

const program = new Command();
const seed = async () => {
  const prisma = new PrismaClient();

  for (let i = 0; i < 10; i++) {
    await prisma.student.upsert({
      where: {
        id: i + 1,
      },

      update: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
      },

      create: {
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
      },
    });
  }
  console.log('Database seeded!');
};

const clear = async () => {
  const prisma = new PrismaClient();

  await prisma.student.deleteMany();

  console.log('Database cleared!');
};

program
  .command('seed')
  .description('Seed the database with fake data')
  .action(async () => {
    await seed();
  });

program
  .command('clear')
  .description('Clear the database')
  .action(async () => {
    await clear();
  });

program
  .command('reset')
  .description('Reset the database')
  .action(async () => {
    await clear();
    await seed();
  });

program.parse();
