import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './app.development.config';
import { DataSource } from 'typeorm';
//Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './user/user.module';
import { BudgetModule } from './modules/budget/budget.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    BudgetModule,
    AccountModule,
    TransactionModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
