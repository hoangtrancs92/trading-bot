import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export const up = async (queryInterface: QueryInterface) => {
  // Assume the Users table has IDs from 1 to 10
  const userIds = Array.from({ length: 10 }, (_, index) => index + 1);

  const posts = [];
  for (let i = 0; i < 20; i++) {
    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      userId: userIds[Math.floor(Math.random() * userIds.length)], // Randomly select userId
      createdAt: new Date(),
      createdBy: null,
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  await queryInterface.bulkInsert('Posts', posts);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete('Posts', {}, {});
};