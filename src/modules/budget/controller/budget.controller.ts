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
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../../auth/guard';

@ApiTags('budgets')
@UseGuards(JwtGuard, ThrottlerGuard)
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

  @Put(':userId/:budgetId')
  @ApiOkResponse({ type: Budget })
  @HttpCode(HttpStatus.NO_CONTENT)
  setDefaultBudget(
    @Param('userId') userId: number,
    @Param('budgetId') budgetId: number,
  ) {
    return this.budgetService.setDefault(userId, budgetId);
  }
}
