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
import { Budget } from 'src/modules/budget/entities';
import { CategoryItem } from 'src/modules/category-item/entities';
import { Transaction } from 'src/modules/transaction/entities';

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

  @OneToMany(() => CategoryItem, (categoryItem) => categoryItem.category)
  categoryItems: CategoryItem[];

  @RelationId((category: Category) => category.categoryItems)
  categoryItemIds: number[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}