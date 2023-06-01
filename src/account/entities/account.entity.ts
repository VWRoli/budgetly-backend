import { ApiProperty } from '@nestjs/swagger';
import { Budget } from 'src/budget/entities';
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
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Budget, (budget) => budget.accounts)
  @JoinColumn()
  budget: Budget;

  @RelationId((account: Account) => account.budget)
  budgetId: string;

  @Column()
  balance: number;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
