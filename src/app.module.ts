import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
//Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BudgetModule } from './budget/budget.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '',
      port: 3030,
      username: '',
      password: '',
      database: '',
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      logging: true,
      // Only enable this option if your application is in development,
      // otherwise use TypeORM migrations to sync entity schemas:
      // https://typeorm.io/#/migrations
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    BudgetModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
