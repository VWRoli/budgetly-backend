import { User } from 'src/auth/entities';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ECurrency } from '../enum/budget.enum';

export class Budget {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  currency: ECurrency;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @RelationId((budget: Budget) => budget.user)
  userId: ObjectId;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @Column({ default: null })
  deleteTimeStamp: Date | null;
}
