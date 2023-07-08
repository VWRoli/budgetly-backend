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
import { Budget } from '../../budget/entities';
import { Transaction } from '../../transaction/entities';
import { SubCategory } from '../../sub-category/entities';

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

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @RelationId((category: Category) => category.transactions)
  transactionIds: number[];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

  @RelationId((category: Category) => category.subCategories)
  subCategoryIds: number[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
