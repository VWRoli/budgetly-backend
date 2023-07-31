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
import { Budget } from '../../budget/entities';
import { SubCategory } from '../../sub-category/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'Store' })
  payee: string;

  @ManyToOne(() => Budget, (budget) => budget.transactions)
  @JoinColumn()
  budget: Budget;

  @RelationId((transaction: Transaction) => transaction.budget)
  @ApiProperty({ example: 1 })
  budgetId: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn()
  account: Account;

  @RelationId((transaction: Transaction) => transaction.account)
  @ApiProperty({ example: 1 })
  accountId: number;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  @JoinColumn()
  category?: Category | null;

  @RelationId((transaction: Transaction) => transaction.category)
  @ApiProperty({ example: 1 })
  categoryId?: number;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.transactions, {
    nullable: true,
  })
  @JoinColumn()
  subCategory?: SubCategory | null;

  @RelationId((transaction: Transaction) => transaction.subCategory)
  @ApiProperty({ example: 1 })
  subCategoryId?: number;

  @Column()
  @ApiProperty({ example: '2023-06-03' })
  date: Date;

  @IsNumber()
  @Column({ nullable: true })
  @ApiProperty({ example: 100 })
  inflow: number;

  @IsNumber()
  @Column({ nullable: true })
  @ApiProperty({ example: null })
  outflow: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
