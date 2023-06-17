import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateBudgetDto } from 'src/modules/budget/dto';
import { UpdateBudgetDto } from 'src/modules/budget/dto/update-budget.dto';
import { ECurrency } from 'src/modules/budget/enum';
import * as request from 'supertest';

describe('Budget endpoints (E2E)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let budgetId: number;

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

  describe('Create user, save id and token', () => {
    it('/auth/signup (POST)', async () => {
      const signupData = {
        email: 'test.budget@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
      expect(response.body.access_token).toBeDefined();
      token = response.body.access_token;
    });

    it('/users/me (GET) - Get own user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      userId = response.body.id;
    });
  });

  describe('POST /budgets', () => {
    it('should create a new budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'My Budget',
        currency: ECurrency.USD,
        userId: userId,
      };

      const response = await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send(createBudgetDto)
        .expect(HttpStatus.CREATED);

      const budget = response.body;

      expect(budget.name).toBeDefined();
      expect(budget.currency).toBeDefined();

      budgetId = budget.id;
    });

    it('should throw error because budget with same currency alrady exists', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'My Budget',
        currency: ECurrency.USD,
        userId: userId,
      };

      await request(app.getHttpServer())
        .post('/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send(createBudgetDto)
        .expect(HttpStatus.CONFLICT);
    });

    it('should throw error because of invalid currency value', async () => {
      const createBudgetDto = {
        name: 'Update Budget again',
        currency: 'invalid currency',
        userId: userId,
      };

      await request(app.getHttpServer())
        .post(`/budgets`)
        .set('Authorization', `Bearer ${token}`)
        .send(createBudgetDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /budgets/:userId', () => {
    it('should return an array of budgets', async () => {
      const response = await request(app.getHttpServer())
        .get(`/budgets/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const budgets = response.body;

      expect(Array.isArray(budgets)).toBe(true);
      budgets.forEach((budget) => {
        expect(budget.name).toBeDefined();
        expect(budget.currency).toBeDefined();
      });
    });
  });

  describe('PUT /budgets/:budgetId', () => {
    it('should update an existing budget', async () => {
      const updateBudgetDto: UpdateBudgetDto = {
        name: 'Updated Budget',
        currency: ECurrency.EUR,
      };

      const response = await request(app.getHttpServer())
        .put(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBudgetDto)
        .expect(HttpStatus.OK);

      const budget = response.body;

      expect(budget.name).toBe(updateBudgetDto.name);
      expect(budget.currency).toBe(updateBudgetDto.currency);
    });

    it('should throw error because of invalid currency value', async () => {
      const updateBudgetDto = {
        name: 'Update Budget to invalid currency',
        currency: 'invalid currency',
        userId: userId,
      };

      await request(app.getHttpServer())
        .put(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBudgetDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /budgets/:budgetId', () => {
    it('should delete budget', async () => {
      await request(app.getHttpServer())
        .delete(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should throw error because it cant find budget with id', async () => {
      await request(app.getHttpServer())
        .delete(`/budgets/${budgetId + 1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/users/me (DELETE)', () => {
    it('Delete own user', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
