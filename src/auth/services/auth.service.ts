import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { SALT_WORK_FACTOR } from '../auth.constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async signUp(dto: CreateUserDto) {
    try {
      //generate the password hash
      const existingUser = await this.repository.findOne({
        where: { email: dto.email },
      });

      //Check for existing user
      if (existingUser) throw new ForbiddenException('Credentials taken');

      //hash password
      const hash = await bcrypt.hash(dto.password, SALT_WORK_FACTOR);

      //create user entity
      const user = this.repository.create({
        email: dto.email,
        hash,
      });

      //save user entity in DB
      return await this.repository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(dto: LoginUserDto) {
    //todo
  }
}
