import { Budget } from 'src/budget/entities';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  RelationId,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @RelationId((user: User) => user.budgets)
  budgetIds: string[];

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
  // defaultBudget: string;
}
