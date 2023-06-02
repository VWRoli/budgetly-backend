import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: LoginUserDto) {
    return this.authService.signIn(dto);
  }
}