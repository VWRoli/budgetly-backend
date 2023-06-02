import { User } from 'src/modules/auth/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from 'src/modules/account/entities';
import { Budget } from 'src/modules/budget/entities';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  budgeted: number;

  @Column()
  outflows: number;

  @Column()
  balance: number;

  @ManyToOne(() => Budget, (budget) => budget.categories)
  @JoinColumn()
  budget: Budget;

  @RelationId((category: Category) => category.budget)
  budgetId: number;

  // categoryitems
  // @OneToMany(() => Account, (account) => account.budget)
  // accounts: Account[];

  // @RelationId((budget: Budget) => budget.accounts)
  // accountIds: number[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
