import { Budget } from 'src/modules/budget/entities';
import { Transaction } from 'src/modules/transaction/entities';
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

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Budget, (budget) => budget.accounts)
  @JoinColumn()
  budget: Budget;

  @RelationId((account: Account) => account.budget)
  budgetId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @RelationId((account: Account) => account.transactions)
  transactionIds: number[];

  @Column()
  balance: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
