import { Table, Column, Model, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { Comment } from './Comment';
import { Category } from './Category';

@Table
export class Post extends Model {
  @Column
  title!: string;

  @Column
  content!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Category)
  @Column
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @HasMany(() => Comment)
  comments?: Comment[];
}