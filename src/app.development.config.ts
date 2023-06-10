import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'host.docker.internal',
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  logging: true,
  synchronize: true,
};

export default databaseConfig;
// port:
// process.env.NODE_ENV === 'development'
//   ? +process.env.DEV_TYPEORM_PORT
//   : +process.env.TEST_TYPEORM_PORT,
// username:
// process.env.NODE_ENV === 'development'
//   ? process.env.DEV_TYPEORM_USERNAME
//   : process.env.TEST_TYPEORM_USERNAME,
// password:
// process.env.NODE_ENV === 'development'
//   ? process.env.DEV_TYPEORM_PASSWORD
//   : process.env.TEST_TYPEORM_PASSWORD,
// database:
// process.env.NODE_ENV === 'development'
//   ? process.env.DEV_TYPEORM_DATABASE
//   : process.env.TEST_TYPEORM_DATABASE,
