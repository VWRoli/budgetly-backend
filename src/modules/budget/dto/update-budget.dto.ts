import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly availableToBudget: number;
}
