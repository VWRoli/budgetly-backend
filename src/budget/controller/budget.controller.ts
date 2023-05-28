import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BudgetService } from '../service';
import { CreateBudgetDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Budget } from '../entities';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('budgets')
@UseGuards(JwtGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}
  @Post()
  @ApiOkResponse({ type: Budget })
  createBudget(@Body() dto: CreateBudgetDto) {
    return this.service.createOne(dto);
  }
}
