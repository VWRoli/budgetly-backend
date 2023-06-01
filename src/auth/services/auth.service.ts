import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { SALT_WORK_FACTOR } from '../auth.constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto) {
    try {
      //Check for existing user
      const existingUser = await this.repository.findOne({
        where: { email: dto.email },
      });
      if (existingUser) throw new ForbiddenException('Credentials taken');
      //hash password
      const hash = await bcrypt.hash(dto.password, SALT_WORK_FACTOR);
      //create user entity
      const user = this.repository.create({
        email: dto.email,
        hash,
      });
      //save user entity in DB
      await this.repository.save(user);
      //send back the user
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  async signIn(dto: LoginUserDto) {
    //find user by email
    const user = await this.repository.findOne({
      where: { email: dto.email },
    });
    //if user does not exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    //compare passwords
    const pwMatches = await bcrypt.compare(dto.password, user.hash);
    //if password is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    //send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const expiry = this.config.get('TOKEN_EXPIRY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiry,
      secret,
    });

    return { access_token: token };
  }
}
