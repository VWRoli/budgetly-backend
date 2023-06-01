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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ enum: ECurrency, enumName: 'ECurrency' })
  currency: ECurrency;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn()
  user: User;

  @RelationId((budget: Budget) => budget.user)
  userId: string;

  @OneToMany(() => Account, (account) => account.budget)
  accounts: Account[];

  @RelationId((budget: Budget) => budget.accounts)
  accountIds: string[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
