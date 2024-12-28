import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Post } from './Post';
import { Comment } from './Comment';

@Table
export class User extends Model {
  @Column
  username!: string;

  @Column
  email!: string;

  @HasMany(() => Post)
  posts?: Post[];

  @HasMany(() => Comment)
  comments?: Comment[];
}