import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
