import { Repository } from 'typeorm';
import { Budget, stubBudget, stubBudgetResponse } from '../entities';
import { BudgetService } from './budget.service';
import { User } from '../../auth/entities';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ECurrency } from '../enum';

const budgetResponseStub = stubBudgetResponse();
const budgetResponseStubs = [budgetResponseStub];

const budgetStub = stubBudget();
const budgetStubs = [budgetStub];

describe('BudgetService', () => {
  let service: BudgetService;
  let repository: Repository<Budget>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            softDelete: jest.fn(),
            setDefault: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<BudgetService>(BudgetService);
    repository = moduleRef.get<Repository<Budget>>(getRepositoryToken(Budget));
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all budgets for a given user', async () => {
      const userId = budgetStub.userId;
      jest.spyOn(repository, 'find').mockResolvedValue(budgetStubs);

      const result = await service.getAll(userId);

      expect(result).toEqual(budgetResponseStubs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a budget', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(budgetStub);

      const result = await service.getOne(budgetStub.id);

      expect(result).toEqual(budgetStub);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getOne(budgetStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createOne', () => {
    it('should create a new budget', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(budgetStub.user);
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(budgetStub);
      jest.spyOn(repository, 'create').mockReturnValue(budgetStub);
      jest.spyOn(repository, 'save').mockResolvedValue(budgetStub);
      jest.spyOn(service, 'setDefault').mockResolvedValue(undefined);

      const result = await service.createOne(budgetStub);

      expect(result).toEqual(budgetResponseStub);
      expect(repository.save).toHaveBeenCalledWith(budgetStub);
      expect(service.setDefault).toHaveBeenCalledWith(
        budgetStub.user.id,
        budgetStub.id,
      );
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOne(budgetStub)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if budget with the same name already exists', async () => {
      const user = budgetStub.user;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'findOne').mockResolvedValue(budgetStub);

      await expect(service.createOne(budgetStub)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing budget', async () => {
      const updatedBudget: Budget = {
        ...budgetStub,
        name: 'Updated Budget',
        currency: ECurrency.GBP,
      };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(budgetStub)
        .mockResolvedValueOnce(budgetStub)
        .mockResolvedValueOnce(null);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedBudget);

      const result = await service.updateOne(budgetStub.userId, updatedBudget);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        ...budgetResponseStub,
        name: 'Updated Budget',
        currency: ECurrency.GBP,
      });
      expect(repository.save).toHaveBeenCalledWith(budgetStub);
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOne(budgetStub.id, budgetStub),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException if another budget with the same name already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(budgetStub);

      await expect(
        service.updateOne(budgetStub.id, budgetStub),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteOne', () => {
    it('should delete an existing budget', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(budgetStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(budgetStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(budgetStub.id);
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(budgetStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('setDefault', () => {
    it('should set the default budget for the user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(budgetStub.user);
      jest.spyOn(repository, 'findOne').mockResolvedValue(budgetStub);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...budgetStub.user,
        defaultBudgetId: budgetStub.id,
      });

      await service.setDefault(budgetStub.user.id, budgetStub.id);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: budgetStub.id },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...budgetStub.user,
        defaultBudgetId: budgetStub.id,
      });
    });

    it('should throw NotFoundException if the user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.setDefault(budgetStub.user.id, budgetStub.id),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException if the budget is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(budgetStub.user);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.setDefault(budgetStub.user.id, budgetStub.id),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
