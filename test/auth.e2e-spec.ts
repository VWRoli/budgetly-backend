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
      .expect(201); // Expected HTTP status code for successful signup

    // Assert any additional expectations
    expect(response.body).toBeDefined();
    //expect(response.body.message).toBe('User created successfully');
    // Add more assertions as needed
  });

  it('/auth/signin (POST) should return access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'Password123',
      })
      .expect(200);

    accessToken = response.body.access_token;
    expect(accessToken).toBeDefined();
  });

  // it('/users/me (GET) should return "Protected Content"', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/users/me')
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .expect(200);

  //   expect(response.body).toEqual('Protected Content');
  // });

  // it('/protected-route (GET) without access token should return Unauthorized', async () => {
  //   await request(app.getHttpServer()).get('/protected-route').expect(401);
  // });

  // Additional test cases...
});
