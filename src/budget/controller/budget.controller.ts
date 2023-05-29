import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BudgetService } from '../service';
import { CreateBudgetDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Budget } from '../entities';
import { JwtGuard } from 'src/auth/guard';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@ApiTags('budgets')
@UseGuards(JwtGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}
  @Post()
  @ApiOkResponse({ type: Budget })
  createBudget(@Body() dto: CreateBudgetDto) {
    return this.budgetService.createOne(dto);
  }

  @Put(':budgetId')
  @ApiOkResponse({ type: Budget })
  updateBudget(
    @Param('budgetId') budgetId: string,
    @Body() body: UpdateBudgetDto,
  ) {
    return this.budgetService.updateOne(budgetId, body);
  }
}
