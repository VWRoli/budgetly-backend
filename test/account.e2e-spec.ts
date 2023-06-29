import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('Account endpoints (E2E)', () => {
  let app: INestApplication;
  let token: string;
  const budgetId = 1;
  let accountId: number;

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

  describe('Log in test user', () => {
    it('Sign in', async () => {
      const signinData = {
        email: 'testUser@test.com',
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
  });

  describe('POST /accounts', () => {
    it('should create a new account', async () => {
      const createAccountDto = {
        name: 'Example Account',
        budgetId: budgetId,
      };

      const response = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(createAccountDto)
        .expect(HttpStatus.CREATED);

      const account = response.body;

      expect(account.name).toBeDefined();
      expect(account.budgetId).toBe(budgetId);
      accountId = account.id;
    });

    it('should throw an error if the account name is missing', async () => {
      const createAccountDto = {
        budgetId: budgetId,
      };

      await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(createAccountDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /accounts/:budgetId', () => {
    it('should return an array of accounts for the specified budget', async () => {
      const response = await request(app.getHttpServer())
        .get(`/accounts/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const accounts = response.body;

      expect(Array.isArray(accounts)).toBe(true);
      accounts.forEach((account) => {
        expect(account.name).toBeDefined();
        expect(account.budgetId).toBe(budgetId);
      });
    });
  });

  describe('PUT /accounts/:accountId', () => {
    it('should update an existing account', async () => {
      const updateAccountDto = {
        name: 'Updated Account',
        budgetId: budgetId,
      };

      const response = await request(app.getHttpServer())
        .put(`/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateAccountDto)
        .expect(HttpStatus.OK);

      const account = response.body;

      expect(account.name).toBe(updateAccountDto.name);
      expect(account.budgetId).toBe(updateAccountDto.budgetId);
    });
  });

  describe('DELETE /accounts/:accountId', () => {
    it('should delete an account', async () => {
      await request(app.getHttpServer())
        .delete(`/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
