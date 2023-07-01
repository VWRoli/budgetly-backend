import { Module } from '@nestjs/common';
import { SubCategoryController } from './controller';
import { SubCategoryService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities';
import { Transaction } from '../transaction/entities';
import { SubCategory } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Transaction, SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
