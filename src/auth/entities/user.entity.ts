import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;

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
