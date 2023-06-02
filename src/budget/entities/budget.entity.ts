import { User } from 'src/auth/entities';
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
import { ECurrency } from '../enum';
import { Account } from 'src/account/entities';
import { ApiProperty } from '@nestjs/swagger';

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

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
