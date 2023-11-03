import { Module } from '@nestjs/common';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../budget/entities';
import { Account } from './entities';
import { Transaction } from '../transaction/entities';
import { BudgetService } from '../budget/service';
import { User } from '../auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Account, Transaction, User])],
  controllers: [AccountController],
  providers: [AccountService, BudgetService],
})
export class AccountModule {}
