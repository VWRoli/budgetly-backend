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
  providers: [TransactionService, AccountService],
})
export class TransactionModule {}
