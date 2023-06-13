import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
