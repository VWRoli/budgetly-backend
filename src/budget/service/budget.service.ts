import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from '../dto';
import { Budget } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
  ) {}
  async createOne(data: CreateBudgetDto) {
    console.log(data);

    //check if budget is already created
    // const existingBudget = await this.repository.findOne({
    //   where: { user: data.user, currency: data.currency },
    // });
  }
}
