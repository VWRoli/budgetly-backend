import { Module } from '@nestjs/common';
import { SubCategoryController } from './controller';
import { SubCategoryService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities';
import { Transaction } from '../transaction/entities';
import { SubCategory } from './entities';
import { CategoryService } from '../category/service';
import { Budget } from '../budget/entities';
import { BudgetService } from '../budget/service';
import { User } from '../auth/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Transaction,
      SubCategory,
      Budget,
      User,
    ]),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, CategoryService, BudgetService],
})
export class SubCategoryModule {}
