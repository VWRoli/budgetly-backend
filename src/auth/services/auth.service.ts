import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { User } from '../entities';
import { SALT_WORK_FACTOR } from '../auth.constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async signup(dto: CreateUserDto) {
    //generate the password hash
    console.log(bcrypt);
    try {
      const hash = await bcrypt.hash(dto.password, SALT_WORK_FACTOR);
      console.log({ hash });
      const user = this.repository.create({
        email: dto.email,
        hash,
      });
      return await this.repository.save(user);
    } catch (error) {
      console.log(error);
    }
  }
}
