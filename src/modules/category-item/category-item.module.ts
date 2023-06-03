import { Module } from '@nestjs/common';
import { CategoryItemController } from './controller';
import { CategoryItemService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities';
import { Transaction } from '../transaction/entities';
import { CategoryItem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Transaction, CategoryItem])],
  controllers: [CategoryItemController],
  providers: [CategoryItemService],
})
export class CategoryItemModule {}
