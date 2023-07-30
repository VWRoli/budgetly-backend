import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ECurrency, ELocale } from '../enum';
import { User } from '../../auth/entities';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';
import { Transaction } from '../../transaction/entities';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ECurrency, enumName: 'ECurrency' })
  currency: ECurrency;

  @Column({ type: 'enum', enum: ELocale, enumName: 'ELocale' })
  locale: ELocale;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn()
  user: User;

  @RelationId((budget: Budget) => budget.user)
  userId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.budget)
  transactions: Transaction[];

  @OneToMany(() => Account, (account) => account.budget)
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.budget)
  categories: Category[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
