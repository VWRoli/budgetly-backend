import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities';
import { CommonService } from 'src/modules/common/service';

@Injectable()
export class UserService extends CommonService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  async deleteOne(id: number) {
    return super.deleteOne(id);
  }
}
