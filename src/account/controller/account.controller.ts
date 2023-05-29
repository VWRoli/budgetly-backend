import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { AccountService } from '../service';
import { Account } from '../entities';
import { CreatAccountDto } from '../dto';

@ApiTags('accounts')
@UseGuards(JwtGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':budgetId')
  @ApiOkResponse({ type: Account, isArray: true })
  getAccounts(@Param('budgetId') budgetId: string) {
    return this.accountService.getAll(budgetId);
  }

  @Post()
  @ApiOkResponse({ type: Account })
  createAccount(@Body() dto: CreatAccountDto) {
    return this.accountService.createOne(dto);
  }
}
