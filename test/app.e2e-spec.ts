import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateBudgetDto } from '../src/modules/budget/dto';
import { ECurrency } from '../src/modules/budget/enum';
import { UpdateBudgetDto } from '../src/modules/budget/dto/update-budget.dto';
import { CreateAccountDto } from '../src/modules/account/dto';
import { UpdateAccountDto } from '../src/modules/account/dto/update-account.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../src/modules/category/dto';
import { Category } from '../src/modules/category/entities';
import { Account } from '../src/modules/account/entities';
import { Budget } from '../src/modules/budget/entities';
import { CreateUserDto, LoginUserDto } from '../src/modules/auth/dto';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from '../src/modules/sub-category/dto';
import { SubCategory } from '../src/modules/sub-category/entities';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../src/modules/transaction/dto';
import { Transaction } from '../src/modules/transaction/entities';

describe('App e2e tests', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let budgetId: number;
  let accountId: number;
  let categoryId: number;
  let subCategoryId: number;
  let transactionId: number;

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

  describe('Auth and user endpoints (E2E)', () => {
    describe('/auth/signup', () => {
      it('Mismatched Passwords', async () => {
        const signupData: CreateUserDto = {
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

      it('Invalid Email Address', async () => {
        const signupData: CreateUserDto = {
          email: 'invalid-email-address', // Provide an invalid email address here
          password: 'Password123',
          confirmPassword: 'Password123',
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupData)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Weak Password', async () => {
        const signupData: CreateUserDto = {
          email: 'test@example.com',
          password: 'weak', // Provide a weak password here
          confirmPassword: 'weak',
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupData)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Sign up', async () => {
        const signupData: CreateUserDto = {
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

      it('Duplicate Signup', async () => {
        const signupData: CreateUserDto = {
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        };

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(signupData)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('/auth/signin', () => {
      it('Sign in', async () => {
        const signinData: LoginUserDto = {
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

      it('Wrong Password', async () => {
        const signinData: LoginUserDto = {
          email: 'test@example.com',
          password: 'WrongPassword', // Provide an incorrect password
        };

        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(signinData)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('Wrong Email Address', async () => {
        const signinData: LoginUserDto = {
          email: 'wrong@example.com', // Provide an incorrect email address
          password: 'Password123',
        };

        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(signinData)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('/auth/signup', () => {
      it('(GET) - Get own user', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

        userId = response.body.id;
      });
    });
  });

  describe('Budget endpoints (E2E)', () => {
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

        const budget: Budget = response.body;

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

        const budgets: Budget[] = response.body;

        expect(Array.isArray(budgets)).toBe(true);
        budgets.forEach((budget: Budget) => {
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

        const budget: Budget = response.body;

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
  });

  describe('Account endpoints (E2E)', () => {
    describe('POST /accounts', () => {
      it('should create a new account', async () => {
        const createAccountDto: CreateAccountDto = {
          name: 'Example Account',
          budgetId: budgetId,
        };

        const response = await request(app.getHttpServer())
          .post('/accounts')
          .set('Authorization', `Bearer ${token}`)
          .send(createAccountDto)
          .expect(HttpStatus.CREATED);

        const account: Account = response.body;

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

        const accounts: Account[] = response.body;

        expect(Array.isArray(accounts)).toBe(true);
        accounts.forEach((account: Account) => {
          expect(account.name).toBeDefined();
          expect(account.budgetId).toBe(budgetId);
        });
      });
    });

    describe('PUT /accounts/:accountId', () => {
      it('should update an existing account', async () => {
        const updateAccountDto: UpdateAccountDto = {
          name: 'Updated Account',
          budgetId: budgetId,
        };

        const response = await request(app.getHttpServer())
          .put(`/accounts/${accountId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateAccountDto)
          .expect(HttpStatus.OK);

        const account: Account = response.body;

        expect(account.name).toBe(updateAccountDto.name);
        expect(account.budgetId).toBe(updateAccountDto.budgetId);
      });
    });
  });
  describe('Category endpoints (E2E)', () => {
    describe('POST /categories', () => {
      it('should create a new category', async () => {
        const createCategoryDto: CreateCategoryDto = {
          title: 'Example Category',
          budgetId: budgetId,
        };

        const response = await request(app.getHttpServer())
          .post('/categories')
          .set('Authorization', `Bearer ${token}`)
          .send(createCategoryDto)
          .expect(HttpStatus.CREATED);

        const category: Category = response.body;

        expect(category.title).toBeDefined();
        expect(category.budgetId).toBe(budgetId);

        categoryId = category.id;
      });

      it('should throw an error if the category title is missing', async () => {
        const createCategoryDto = {
          budgetId: budgetId,
        };

        await request(app.getHttpServer())
          .post('/categories')
          .set('Authorization', `Bearer ${token}`)
          .send(createCategoryDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('GET /categories/:budgetId', () => {
      it('should return an array of categories for the specified budget', async () => {
        const response = await request(app.getHttpServer())
          .get(`/categories/${budgetId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

        const categories: Category[] = response.body;

        expect(Array.isArray(categories)).toBe(true);
        categories.forEach((category: Category) => {
          expect(category.title).toBeDefined();
          expect(category.budgetId).toBe(budgetId);
        });
      });
    });

    describe('PUT /categories/:categoryId', () => {
      it('should update an existing category', async () => {
        const updateCategoryDto: UpdateCategoryDto = {
          title: 'Updated Category',
          budgetId: budgetId,
        };

        const response = await request(app.getHttpServer())
          .put(`/categories/${categoryId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateCategoryDto)
          .expect(HttpStatus.OK);

        const category: Category = response.body;

        expect(category.title).toBe(updateCategoryDto.title);
        expect(category.budgetId).toBe(updateCategoryDto.budgetId);
      });
    });
  });

  describe('SubCategory endpoints (E2E)', () => {
    describe('POST /sub-categories', () => {
      it('should create a new sub category', async () => {
        const createSubCategoryDto: CreateSubCategoryDto = {
          title: 'Example Category Item',
          categoryId,
        };

        const response = await request(app.getHttpServer())
          .post('/sub-categories')
          .set('Authorization', `Bearer ${token}`)
          .send(createSubCategoryDto)
          .expect(HttpStatus.CREATED);

        const subCategory: SubCategory = response.body;

        expect(subCategory.title).toBeDefined();
        expect(subCategory.categoryId).toBe(categoryId);
        subCategoryId = subCategory.id;
      });

      it('should throw an error if the sub category title is missing', async () => {
        const createSubCategoryDto = {
          categoryId,
        };

        await request(app.getHttpServer())
          .post('/sub-categories')
          .set('Authorization', `Bearer ${token}`)
          .send(createSubCategoryDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('GET /sub-categories/:categoryId', () => {
      it('should return an array of sub categorys for the specified category', async () => {
        const response = await request(app.getHttpServer())
          .get(`/sub-categories/${categoryId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

        const subCategorys: SubCategory[] = response.body;

        expect(Array.isArray(subCategorys)).toBe(true);
        subCategorys.forEach((subCategory: SubCategory) => {
          expect(subCategory.title).toBeDefined();
          expect(subCategory.categoryId).toBe(categoryId);
        });
      });
    });

    describe('PUT /sub-categories/:subCategoryId', () => {
      it('should update an existing sub category', async () => {
        const updateSubCategoryDto: UpdateSubCategoryDto = {
          title: 'Updated SubCategory',
          categoryId,
        };

        const response = await request(app.getHttpServer())
          .put(`/sub-categories/${subCategoryId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateSubCategoryDto)
          .expect(HttpStatus.OK);

        const subCategory: SubCategory = response.body;

        expect(subCategory.title).toBe(updateSubCategoryDto.title);
        expect(subCategory.categoryId).toBe(updateSubCategoryDto.categoryId);
      });
    });
  });

  describe('Transaction endpoints (E2E)', () => {
    describe('POST /transactions', () => {
      it('should create a new transaction', async () => {
        const createTransactionDto: CreateTransactionDto = {
          payee: 'Example Transaction',
          accountId,
          categoryId,
          subCategoryId,
          date: new Date(),
          inflow: 100,
          outflow: null,
        };

        const response = await request(app.getHttpServer())
          .post('/transactions')
          .set('Authorization', `Bearer ${token}`)
          .send(createTransactionDto)
          .expect(HttpStatus.CREATED);

        const transaction: Transaction = response.body;

        expect(transaction.payee).toBeDefined();
        expect(transaction.accountId).toBe(accountId);
        transactionId = transaction.id;
      });

      it('should throw an error if the transaction payee is missing', async () => {
        const createTransactionDto = {
          budgetId: budgetId,
        };

        await request(app.getHttpServer())
          .post('/transactions')
          .set('Authorization', `Bearer ${token}`)
          .send(createTransactionDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('GET /transactions/:accountId', () => {
      it('should return an array of transactions for the specified account', async () => {
        const response = await request(app.getHttpServer())
          .get(`/transactions/${accountId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

        const transactions: Transaction[] = response.body;

        expect(Array.isArray(transactions)).toBe(true);
        transactions.forEach((transaction: Transaction) => {
          expect(transaction.payee).toBeDefined();
          expect(transaction.accountId).toBe(accountId);
        });
      });
    });

    describe('PUT /transactions/:transactionId', () => {
      it('should update an existing transaction', async () => {
        const updateTransactionDto: UpdateTransactionDto = {
          payee: 'Updated Transaction',
          accountId,
          categoryId,
          subCategoryId,
          date: new Date(),
          inflow: 100,
          outflow: null,
        };

        const response = await request(app.getHttpServer())
          .put(`/transactions/${transactionId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateTransactionDto)
          .expect(HttpStatus.OK);

        const transaction: Transaction = response.body;

        expect(transaction.payee).toBe(updateTransactionDto.payee);
        expect(transaction.accountId).toBe(updateTransactionDto.accountId);
      });
    });
  });

  describe('Delete endpoints (E2E)', () => {
    describe('DELETE /transactions/:transactionId', () => {
      it('should delete a transaction', async () => {
        await request(app.getHttpServer())
          .delete(`/transactions/${transactionId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.NO_CONTENT);
      });
    });

    describe('DELETE /sub-categories/:subCategoryId', () => {
      it('should delete a sub category', async () => {
        await request(app.getHttpServer())
          .delete(`/sub-categories/${subCategoryId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.NO_CONTENT);
      });
    });

    describe('DELETE /categories/:categoryId', () => {
      it('should delete a category', async () => {
        await request(app.getHttpServer())
          .delete(`/categories/${categoryId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.NO_CONTENT);
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

    describe('DELETE /budgets/:budgetId', () => {
      it('should delete budget', async () => {
        await request(app.getHttpServer())
          .delete(`/budgets/${budgetId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.NO_CONTENT);
      });
    });

    it('(DELETE) - Delete own user', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
