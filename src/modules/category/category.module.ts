import { Module } from '@nestjs/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../budget/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
