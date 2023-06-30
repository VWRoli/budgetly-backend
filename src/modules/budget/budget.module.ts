import { Module } from '@nestjs/common';
import { BudgetService } from './service';
import { BudgetController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities';
import { Category } from '../category/entities';
import { User } from '../auth/entities';
import { Account } from '../account/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User, Account, Category])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
