import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { User } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async signup(dto: CreateUserDto) {
    try {
      const user = this.repository.create(dto);
      return await this.repository.save(user);
    } catch (error) {
      console.log(error);
    }
  }
}
