import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Command } from 'commander';
import * as bcrypt from 'bcrypt';

const program = new Command();

const seed = async () => {
  const prisma = new PrismaClient();
  const generatedAccounts: { Role: string; Email: string; Password: string }[] =
    [];

  console.log('Seeding Students...');
  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = faker.internet.email();

    await prisma.student.upsert({
      where: { id: i + 1 },
      update: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        email: email,
        hashedPassword: hashedPassword,
      },
      create: {
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    generatedAccounts.push({
      Role: 'Student',
      Email: email,
      Password: plainPassword,
    });
  }

  console.log('Seeding Users...');
  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = faker.internet.email();

    await prisma.user.upsert({
      where: { id: i + 1 },
      update: {
        fullName: faker.person.fullName(),
        email: email,
        hashedPassword: hashedPassword,
      },
      create: {
        id: i + 1,
        fullName: faker.person.fullName(),
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    generatedAccounts.push({
      Role: 'User',
      Email: email,
      Password: plainPassword,
    });
  }

  console.table(generatedAccounts);

  console.log('--------------------------------------------------\n');
};

const clear = async () => {
  const prisma = new PrismaClient();

  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  console.log('DB Deleted Successfully!');
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
