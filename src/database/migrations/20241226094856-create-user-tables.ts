import { QueryInterface, DataTypes } from 'sequelize';
import { commonColumns } from '../commonColumns';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...commonColumns,
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('Users');
};