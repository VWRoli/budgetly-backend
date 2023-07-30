import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities';
import { Transaction } from './entities';
import { Category } from '../category/entities';
import { SubCategory } from '../sub-category/entities';
import { AccountService } from '../account/service';
import { Budget } from '../budget/entities';
import { TransactionService } from './service';
import { SubCategoryService } from '../sub-category/service';
import { CategoryService } from '../category/service';
import { BudgetService } from '../budget/service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Transaction,
      Category,
      SubCategory,
      Budget,
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    BudgetService,
    TransactionService,
    AccountService,
    SubCategoryService,
    CategoryService,
  ],
})
export class TransactionModule {}
