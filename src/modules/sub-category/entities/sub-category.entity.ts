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
import { Category } from '../../category/entities';
import { Transaction } from '../../transaction/entities';

@Entity()
export class SubCategory {
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

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn()
  category: Category;

  @RelationId((subCategory: SubCategory) => subCategory.category)
  categoryId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.subCategory)
  transactions: Transaction[];

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
