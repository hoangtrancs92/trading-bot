// Seeder file (example: src/seeders/2023122701-demo-users.ts)
import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../utils/hashPassword.util';

export const up = async (queryInterface: QueryInterface) => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      name: faker.commerce.productName(),
      createdAt: new Date(),
      createdBy: null,
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  await queryInterface.bulkInsert('Categories', users);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete('Categories', {}, {});
};
