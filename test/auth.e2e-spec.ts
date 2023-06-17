import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('Auth and user endpoints (E2E)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/signup (POST) - Mismatched Passwords', async () => {
    const signupData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword', // Provide a different password here
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/signup (POST) - Invalid Email Address', async () => {
    const signupData = {
      email: 'invalid-email-address', // Provide an invalid email address here
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/signup (POST) - Weak Password', async () => {
    const signupData = {
      email: 'test@example.com',
      password: 'weak', // Provide a weak password here
      confirmPassword: 'weak',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupData)
      .expect(HttpStatus.BAD_REQUEST);
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
      .expect(HttpStatus.CREATED);

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
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/auth/signin (POST) - ', async () => {
    const signinData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(signinData)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.access_token).toBeDefined();
    token = response.body.access_token;
  });

  it('/auth/signin (POST) - Wrong Password', async () => {
    const signinData = {
      email: 'test@example.com',
      password: 'WrongPassword', // Provide an incorrect password
    };

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send(signinData)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/auth/signin (POST) - Wrong Email Address', async () => {
    const signinData = {
      email: 'wrong@example.com', // Provide an incorrect email address
      password: 'Password123',
    };

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send(signinData)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/users/me (GET) - Get own user', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

  it('/users/me (DELETE) - Delete own user', async () => {
    await request(app.getHttpServer())
      .delete('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
