import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async deleteOne(id: any): Promise<void> {
    try {
      const entity = await this.repository.findOne(id);

      if (!entity) {
        throw new NotFoundException(`No entity found with the provided id`);
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
