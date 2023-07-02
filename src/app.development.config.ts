import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'host.docker.internal',
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.TYPEORM_DATABASE_TEST
      : process.env.TYPEORM_DATABASE_DEV,
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  logging: false,
  synchronize: true,
};

export default databaseConfig;
