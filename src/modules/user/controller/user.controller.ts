import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/decorators';
import { User } from 'src/modules/auth/entities';
import { JwtGuard } from 'src/modules/auth/guard';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
