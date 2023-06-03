import { IsNumber } from 'class-validator';
import { Account } from 'src/modules/account/entities';
import { CategoryItem } from 'src/modules/category-item/entities';
import { Category } from 'src/modules/category/entities';
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
