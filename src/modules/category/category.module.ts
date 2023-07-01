import { Module } from '@nestjs/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../budget/entities';
import { SubCategory } from '../sub-category/entities';
import { Transaction } from '../transaction/entities';
import { Category } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, Category, SubCategory, Transaction]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
