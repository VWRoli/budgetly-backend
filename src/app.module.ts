import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
//Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './user/user.module';
import { BudgetModule } from './modules/budget/budget.module';
import { AccountModule } from './modules/account/account.module';
import { DataSource } from 'typeorm';
import databaseConfig from './app.development.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    BudgetModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
