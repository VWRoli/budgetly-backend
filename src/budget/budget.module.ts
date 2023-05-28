import { Module } from '@nestjs/common';
import { BudgetService } from './service';
import { BudgetController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
