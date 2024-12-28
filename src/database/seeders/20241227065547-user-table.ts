// Seeder file (example: src/seeders/2023122701-demo-users.ts)
import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../utils/hashPassword.util';

export const up = async (queryInterface: QueryInterface) => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    // Wait for the password to be hashed
    const hashedPassword = await hashPassword("123456789");
    users.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: hashedPassword,
      createdAt: new Date(),
      createdBy: null,
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  await queryInterface.bulkInsert('Users', users);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete('Users', {}, {});
};
