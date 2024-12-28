import { QueryInterface, DataTypes } from 'sequelize';
import { commonColumns } from '../commonColumns';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('Comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    ...commonColumns,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('Comments');
};