import { IsNumber } from 'class-validator';
import { Account } from 'src/modules/account/entities';
import {
  Column,
  CreateDateColumn,
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

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
