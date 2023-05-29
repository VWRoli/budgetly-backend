import { User } from 'src/auth/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ECurrency } from '../enum';
import { Account } from 'src/account/entities';

@Entity()
export class Budget {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ enum: ECurrency, enumName: 'ECurrency' })
  currency: ECurrency;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn()
  user: User;

  @RelationId((budget: Budget) => budget.user)
  userId: ObjectId;

  @OneToMany(() => Account, (account) => account.budget)
  accounts: Account[];

  @RelationId((budget: Budget) => budget.accounts)
  accountIds: ObjectId[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
