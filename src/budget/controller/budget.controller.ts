import { Body, Controller, Post } from '@nestjs/common';
import { BudgetService } from '../service';
import { CreateBudgetDto } from '../dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Budget } from '../entities';

@Controller('budgets')
export class BudgetController {
  constructor(private service: BudgetService) {}
  @Post()
  @ApiOkResponse({ type: Budget })
  createBudget(@Body() dto: CreateBudgetDto) {
    return this.service.createOne(dto);
  }
}
