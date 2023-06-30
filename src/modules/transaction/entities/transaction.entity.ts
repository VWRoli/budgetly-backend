import { IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';
import { CategoryItem } from '../../category-item/entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  payee: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn()
  account: Account;

  @RelationId((transaction: Transaction) => transaction.account)
  accountId: number;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn()
  category: Category;

  @RelationId((transaction: Transaction) => transaction.category)
  categoryId: number;

  @ManyToOne(() => CategoryItem, (categoryItem) => categoryItem.transactions)
  @JoinColumn()
  categoryItem: CategoryItem;

  @RelationId((transaction: Transaction) => transaction.categoryItem)
  categoryItemId: number;

  @Column()
  date: Date;

  @IsNumber()
  @Column({ nullable: true })
  inflow: number;

  @IsNumber()
  @Column({ nullable: true })
  outflow: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
