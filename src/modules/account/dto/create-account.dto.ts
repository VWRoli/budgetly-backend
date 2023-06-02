import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example account', required: true })
  readonly name: string;

  @IsMongoId()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
