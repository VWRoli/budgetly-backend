import { Injectable } from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';

@Injectable()
export class TransactionService {
  async getAll(userId: number) {}
  async createOne(data: CreateTransactionDto) {}

  async updateOne(id: number, data: UpdateTransactionDto) {}

  async deleteOne(id: number) {}
}
