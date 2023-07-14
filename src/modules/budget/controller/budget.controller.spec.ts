import { Repository } from 'typeorm';
import { Budget, stubBudget } from '../entities';
import { BudgetService } from '../service';
import { BudgetController } from './budget.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../auth/entities';

const budgetStub = stubBudget();
const budgetStubs = [budgetStub];

describe('BudgetController', () => {
  let controller: BudgetController;
  let service: BudgetService;
  let repository: Repository<Budget>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: +process.env.THROTTLER_TTL,
          limit: +process.env.THROTTLER_LIMIT,
        }),
      ],
      controllers: [BudgetController],
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<BudgetService>(BudgetService);
    controller = moduleRef.get<BudgetController>(BudgetController);
    repository = moduleRef.get<Repository<Budget>>(getRepositoryToken(Budget));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBudgets', () => {
    it('should return an array of budgets', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(budgetStubs);
      const result = await controller.getBudgets(budgetStub.userId);

      expect(result).toEqual(budgetStubs);
    });
  });

  describe('createBudget', () => {
    it('should create a new budget', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(budgetStub);
      const result = await controller.createBudget(budgetStub);

      expect(result).toEqual(budgetStub);
    });
  });

  describe('updateBudget', () => {
    it('should update an existing budget', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(budgetStub);
      const result = await controller.updateBudget(budgetStub.id, budgetStub);

      expect(result).toEqual(budgetStub);
    });
  });

  describe('deleteBudget', () => {
    it('should delete an existing budget', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteBudget(budgetStub.id);

      expect(result).toBeUndefined();
    });
  });

  describe('set as default budget', () => {
    it('should set budget as default for user', async () => {
      jest.spyOn(service, 'setDefault').mockResolvedValue(undefined);
      const result = await controller.setDefaultBudget(
        budgetStub.user.id,
        budgetStub.id,
      );

      expect(result).toBeUndefined();
    });
  });
});
