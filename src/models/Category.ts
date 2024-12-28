import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Post } from './Post';

@Table
export class Category extends Model {
  @Column
  name!: string;

  @HasMany(() => Post)
  posts?: Post[];
}