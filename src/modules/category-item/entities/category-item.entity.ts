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
import { Category } from 'src/modules/category/entities';
import { Transaction } from 'src/modules/transaction/entities';

@Entity()
export class CategoryItem {
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

  @ManyToOne(() => Category, (category) => category.categoryItems)
  @JoinColumn()
  category: Category;

  @RelationId((categoryItem: CategoryItem) => categoryItem.category)
  categoryId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.categoryItem)
  transactions: Transaction[];

  @RelationId((categoryItem: CategoryItem) => categoryItem.transactions)
  transactionIds: number[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
