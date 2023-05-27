import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
