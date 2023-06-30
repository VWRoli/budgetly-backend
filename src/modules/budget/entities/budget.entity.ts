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
import { ECurrency } from '../enum';
import { User } from '../../auth/entities';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ECurrency, enumName: 'ECurrency' })
  currency: ECurrency;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn()
  user: User;

  @RelationId((budget: Budget) => budget.user)
  userId: number;

  @OneToMany(() => Account, (account) => account.budget)
  accounts: Account[];

  @RelationId((budget: Budget) => budget.accounts)
  accountIds: number[];

  @OneToMany(() => Category, (category) => category.budget)
  categories: Category[];

  @RelationId((budget: Budget) => budget.categories)
  categoryIds: number[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
