import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './app.development.config';
import { DataSource } from 'typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
//Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BudgetModule } from './modules/budget/budget.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL,
      limit: +process.env.THROTTLER_LIMIT,
    }),
    AuthModule,
    UserModule,
    BudgetModule,
    AccountModule,
    TransactionModule,
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
