import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':userId')
  @ApiOkResponse({ type: Budget, isArray: true })
  getBudgets(@Param('userId') userId: number) {
    return this.budgetService.getAll(userId);
  }

  @Post()
  @ApiOkResponse({ type: Budget })
  createBudget(@Body() dto: CreateBudgetDto) {
    return this.budgetService.createOne(dto);
  }

  @Put(':budgetId')
  @ApiOkResponse({ type: Budget })
  updateBudget(
    @Param('budgetId') budgetId: number,
    @Body() body: UpdateBudgetDto,
  ) {
    return this.budgetService.updateOne(budgetId, body);
  }

  @Delete(':budgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBudget(@Param('budgetId') budgetId: number) {
    return this.budgetService.deleteOne(budgetId);
  }
}
