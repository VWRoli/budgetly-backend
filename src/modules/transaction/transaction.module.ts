import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities';
import { Transaction } from './entities';
import { Category } from '../category/entities';
import { SubCategory } from '../sub-category/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Transaction, Category, SubCategory]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
