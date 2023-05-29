import { Module } from '@nestjs/common';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/budget/entities';
import { Account } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Account])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
