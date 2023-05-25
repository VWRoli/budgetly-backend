import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  providers: [UserController],
})
export class UserModule {}
