import { QueryInterface, DataTypes } from 'sequelize';
import { commonColumns } from '../commonColumns';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('Posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    ...commonColumns,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('Posts');
};