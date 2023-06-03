import { Module } from '@nestjs/common';
import { BudgetService } from './service';
import { BudgetController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities';
import { User } from 'src/modules/auth/entities';
import { Account } from 'src/modules/account/entities';
import { Category } from '../category/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User, Account, Category])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
