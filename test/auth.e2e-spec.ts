import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const signupData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/signup (POST) - Duplicate Signup', async () => {
    const signupData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(403); // Expected HTTP status code for duplicate signup
  });
});
