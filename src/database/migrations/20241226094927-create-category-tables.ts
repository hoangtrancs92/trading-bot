import { QueryInterface, DataTypes } from 'sequelize';
import { commonColumns } from '../commonColumns';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('Categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...commonColumns,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('Cateogries');
};