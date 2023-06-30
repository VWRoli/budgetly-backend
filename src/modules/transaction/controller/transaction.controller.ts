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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../service';
import { Transaction } from '../entities';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../../auth/guard';

@ApiTags('transactions')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':accountId')
  @ApiOkResponse({ type: Transaction, isArray: true })
  getTransactions(@Param('accountId') accountId: number) {
    return this.transactionService.getAll(accountId);
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
}
