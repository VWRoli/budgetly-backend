import { Budget } from 'src/budget/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @ManyToOne(() => Budget, (budget) => budget.accounts)
  @JoinColumn()
  budget: Budget;

  @RelationId((account: Account) => account.budget)
  budgetId: ObjectId;

  @Column()
  balance: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
