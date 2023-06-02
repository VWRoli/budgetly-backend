import { Module } from '@nestjs/common';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/modules/budget/entities';
import { Account } from './entities';
import { Transaction } from '../transaction/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Account, Transaction])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
