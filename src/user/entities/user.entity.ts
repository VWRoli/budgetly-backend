import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  // @Column()
  // email: string;

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
