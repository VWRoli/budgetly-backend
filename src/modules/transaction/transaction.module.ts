import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities';
import { Transaction } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
