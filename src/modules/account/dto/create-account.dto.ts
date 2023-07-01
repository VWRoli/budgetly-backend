import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example account', required: true })
  readonly name: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
