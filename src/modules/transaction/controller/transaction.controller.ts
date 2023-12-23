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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../service';
import { Transaction } from '../entities';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  UpdateTransactionDto,
} from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../../auth/guard';
import { PageDto, PageOptionsDto } from '../../common/dto';

@ApiTags('transactions')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':accountId')
  @HttpCode(HttpStatus.OK)
  async getTransactionsByAccountId(
    @Param('accountId') accountId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TransactionResponseDto>> {
    return this.transactionService.getTransactionsByAccountId(
      accountId,
      pageOptionsDto,
    );
  }
  @Get('/budget/:budgetId')
  @HttpCode(HttpStatus.OK)
  async getTransactionsByBudgetId(
    @Param('budgetId') budgetId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TransactionResponseDto>> {
    return this.transactionService.getTransactionsByBudgetId(
      budgetId,
      pageOptionsDto,
    );
  }

  @Post()
  @ApiOkResponse({ type: Transaction })
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createOne(dto);
  }

  @Put(':transactionId')
  @ApiOkResponse({ type: Transaction })
  updateTransaction(
    @Param('transactionId') transactionId: number,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.transactionService.updateOne(transactionId, body);
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTransaction(@Param('transactionId') transactionId: number) {
    this.transactionService.deleteOne(transactionId);
  }

  @Get('/payees/:budgetId')
  @ApiOkResponse({ type: Transaction, isArray: true })
  getPayees(@Param('budgetId') budgetId: number): Promise<string[]> {
    return this.transactionService.getAllPayees({
      where: { budget: { id: budgetId } },
    });
  }
}
