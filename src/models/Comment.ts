import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './User';
import { Post } from './Post';

@Table
export class Comment extends Model {
  @Column
  content?: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Post)
  @Column
  postId!: number;

  @BelongsTo(() => Post)
  post!: Post;
}