import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export const up = async (queryInterface: QueryInterface) => {
  // Assume the Users table has IDs from 1 to 10 and Posts has IDs from 1 to 20
  const userIds = Array.from({ length: 10 }, (_, index) => index + 1);
  const postIds = Array.from({ length: 20 }, (_, index) => index + 1);

  const comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push({
      content: faker.lorem.sentences(2),
      userId: userIds[Math.floor(Math.random() * userIds.length)], // Randomly select userId
      postId: postIds[Math.floor(Math.random() * postIds.length)], // Randomly select postId
      createdAt: new Date(),
      createdBy: null,
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  await queryInterface.bulkInsert('Comments', comments);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete('Comments', {}, {});
};