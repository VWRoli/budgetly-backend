import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from '../../account/account.constants';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Name must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Example account', required: true })
  readonly name: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
