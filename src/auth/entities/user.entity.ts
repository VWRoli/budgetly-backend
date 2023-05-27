import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  hash: string;

  // @Column()
  // balance: number;

  // @Column()
  // budgeted: number;

  // @Column()
  // available: number;

  // @Column()
  // accounts: string[]; //todo

  // @Column()
  // defaultBudget: string;
}
