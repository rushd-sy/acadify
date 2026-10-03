import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Command } from 'commander';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

const seed = async () => {
  const prisma = new PrismaClient();
  const generatedAccounts: { Role: string; Email: string; Password: string }[] =
    [];

  console.log('Seeding Users (Regular)...');
  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();

    await prisma.user.upsert({
      where: { id: i + 1 },
      update: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
        email: email,
        hashedPassword: hashedPassword,
      },
      create: {
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
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

  console.log('Seeding Students (with associated Users)...');
  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();

    const userId = i + 11;

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
        email: email,
        hashedPassword: hashedPassword,
      },
      create: {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    await prisma.student.upsert({
      where: { userId: userId },
      update: {
        userId: userId,
      },
      create: {
        userId: userId,
      },
    });

    generatedAccounts.push({
      Role: 'Student',
      Email: email,
      Password: plainPassword,
    });
  }

  console.log('Seeding Teachers (with associated Users)...');
  const degrees = [
    'Master in Mathematics',
    'PhD in Physics',
    'Bachelor of Computer Science',
    'Master in English Literature',
    'PhD in History',
  ];
  for (let i = 0; i < 10; i++) {
    const plainPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();

    const userId = i + 21;
    const degree = degrees[i % degrees.length];

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
        email: email,
        hashedPassword: hashedPassword,
      },
      create: {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: phoneNumber,
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    await prisma.teacher.upsert({
      where: { userId: userId },
      update: {
        degree: degree,
      },
      create: {
        userId: userId,
        degree: degree,
      },
    });

    generatedAccounts.push({
      Role: 'Teacher',
      Email: email,
      Password: plainPassword,
    });
  }

  console.log('Seeding Grades...');
  const gradesData = ['10th Grade', '11th Grade', '12th Grade'];
  for (let i = 0; i < gradesData.length; i++) {
    await prisma.grade.upsert({
      where: { id: i + 1 },
      update: { name: gradesData[i] },
      create: { id: i + 1, name: gradesData[i] },
    });
  }

  console.log('Seeding Sections...');
  const sectionsConfig = [
    { id: 1, name: 'Section A - 10th Grade', gradeId: 1, teachersCount: 4 },
    { id: 2, name: 'Section B - 10th Grade', gradeId: 1, teachersCount: 3 },
    { id: 3, name: 'Section A - 11th Grade', gradeId: 2, teachersCount: 2 },
    { id: 4, name: 'Section A - 12th Grade', gradeId: 3, teachersCount: 0 },
  ];

  for (const section of sectionsConfig) {
    await prisma.section.upsert({
      where: { id: section.id },
      update: {
        name: section.name,
        academicYear: '2026-2027',
        gradeId: section.gradeId,
      },
      create: {
        id: section.id,
        name: section.name,
        academicYear: '2026-2027',
        gradeId: section.gradeId,
      },
    });
  }

  console.log('Seeding Curriculums...');
  const curriculumsData = [
    { name: 'Mathematics', description: 'Algebra, Geometry, and Calculus' },
    { name: 'Physics', description: 'Mechanics and Thermodynamics' },
    {
      name: 'Computer Science',
      description: 'Programming and Data Structures',
    },
  ];

  for (let i = 0; i < curriculumsData.length; i++) {
    await prisma.curriculum.upsert({
      where: { id: i + 1 },
      update: {
        name: curriculumsData[i].name,
        description: curriculumsData[i].description,
      },
      create: {
        id: i + 1,
        name: curriculumsData[i].name,
        description: curriculumsData[i].description,
      },
    });
  }

  console.log('Seeding TeacherCurriculum Relations...');
  let relationId = 1;
  let currentTeacherId = 21;

  for (const section of sectionsConfig) {
    for (let i = 0; i < section.teachersCount; i++) {
      const randomCurriculumId = Math.floor(Math.random() * 3) + 1;

      await prisma.teacherCurriculum.upsert({
        where: { id: relationId },
        update: {
          userId: currentTeacherId,
          sectionId: section.id,
          curriculumId: randomCurriculumId,
        },
        create: {
          id: relationId,
          userId: currentTeacherId,
          sectionId: section.id,
          curriculumId: randomCurriculumId,
        },
      });

      relationId++;
      currentTeacherId++;
    }
  }

  const outputPath = path.join(process.cwd(), 'seeded-accounts.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(generatedAccounts, null, 2),
    'utf-8',
  );
  console.log(`\n✅ Accounts generated and securely saved to: ${outputPath}`);
  console.log('----------------------');

  console.log('Synchronizing PostgreSQL Auto-Increment Sequences...');
  await prisma.$executeRawUnsafe(
    `SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Grade_id_seq"', (SELECT MAX(id) FROM "Grade"));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Section_id_seq"', (SELECT MAX(id) FROM "Section"));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Curriculum_id_seq"', (SELECT MAX(id) FROM "Curriculum"));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"TeacherCurriculum_id_seq"', (SELECT MAX(id) FROM "TeacherCurriculum"));`,
  );
  console.log('✅ Sequences synchronized successfully.\n');
};

const clear = async () => {
  const prisma = new PrismaClient();

  await prisma.teacherCurriculum.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.section.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.grade.deleteMany();
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
