import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Account } from '../entities';
import { CreateAccountDto } from '../dto';
import { UpdateAccountDto } from '../dto';
import { Budget } from '../../budget/entities';
import { AccountResponseDto } from '../../account/dto';
import { createAccountResponseDto } from '../account.helpers';
import { BudgetService } from '../../budget/service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private repository: Repository<Account>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private readonly budgetService: BudgetService,
  ) {}

  async getAll(budgetId: number): Promise<AccountResponseDto[]> {
    const accounts = await this.repository.find({
      where: { budget: { id: budgetId } },
      select: ['id', 'name', 'balance'],
    });

    //format response
    const responseAccounts: AccountResponseDto[] = accounts.map((account) =>
      createAccountResponseDto(account),
    );

    return responseAccounts;
  }

  async createOne(data: CreateAccountDto): Promise<AccountResponseDto> {
    //check if budget exists
    const budget = await this.budgetRepository.findOne({
      where: {
        id: data.budgetId,
      },
    });
    if (!budget) {
      throw new NotFoundException(`No budget with the provided id`);
    }
    // check if data is already created
    const existingAccount = await this.repository.findOne({
      where: {
        name: data.name,
        budget: { id: budget.id }, // Filter by the budget's ID
      },
    });
    if (existingAccount) {
      throw new ConflictException(
        `You already have an account with the same name`,
      );
    }

    // Create a new instance of the Account entity
    const account = this.repository.create({
      name: data.name,
      balance: data.balance || 0,
      budget: budget, // Assign the budget object to the 'budget' property
    });

    if (data.balance > 0) {
      //update budget with available amount
      await this.budgetService.updateOne(budget.id, {
        ...budget,
        availableToBudget: budget.availableToBudget + data.balance,
      });
    }

    // Save the account entity in the DB
    const savedAccount = await this.repository.save(account);

    //format response
    return createAccountResponseDto(savedAccount);
  }

  async updateOne(
    id: number,
    data: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    const currentAccount = await this.repository.findOne({
      where: { id },
    });
    if (!currentAccount) {
      throw new NotFoundException('No Account found with the provided id.');
    }
    // check if data is already created
    const existingAccount = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentAccount ID from the results
        name: data.name,
        budget: { id: data.budgetId }, // Filter by the budget's ID
      },
    });
    if (existingAccount) {
      throw new ConflictException(
        `You already have an account with the same name.`,
      );
    }

    // Update the properties of the currentAccount entity
    currentAccount.name = data.name;
    currentAccount.balance = data.balance;

    // Save the updated Account entity in the database
    await this.repository.save(currentAccount);

    //format response
    return createAccountResponseDto(currentAccount);
  }

  async deleteOne(id: number) {
    try {
      const currentAccount = await this.repository.findOne({
        where: { id },
        relations: { transactions: true },
      });
      if (!currentAccount) {
        throw new NotFoundException('No account found with the provided id.');
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
