import { Module } from '@nestjs/common';
import { BudgetService } from './service';
import { BudgetController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities';
import { User } from 'src/auth/entities';
import { Account } from 'src/account/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User, Account])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
