import { Budget } from 'src/modules/budget/entities';
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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  hash: string;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @RelationId((user: User) => user.budgets)
  budgetIds: string[];

  @Column({ nullable: true })
  defaultBudgetId: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
