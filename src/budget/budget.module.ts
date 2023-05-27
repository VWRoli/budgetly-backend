import { Module } from '@nestjs/common';
import { BudgetService } from './service';
import { BudgetController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
