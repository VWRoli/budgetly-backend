import { Repository } from 'typeorm';
import { Category, stubCategory, stubCategoryResponse } from '../entities';
import { CategoryService } from './category.service';
import { Budget } from '../../budget/entities';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const categoryResponseStub = stubCategoryResponse();
const categoryResponseStubs = [categoryResponseStub];

const categoryStub = stubCategory();
const categoryStubs = [categoryStub];

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;
  let budgetRepository: Repository<Budget>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryStub),
            save: jest.fn().mockResolvedValue(categoryStub),
            find: jest.fn().mockResolvedValue(categoryStub),
            create: jest.fn().mockResolvedValue(categoryStub),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Budget),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<CategoryService>(CategoryService);
    repository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    budgetRepository = moduleRef.get<Repository<Budget>>(
      getRepositoryToken(Budget),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all categories for a given budget', async () => {
      const budgetId = categoryStub.budgetId;

      jest.spyOn(repository, 'find').mockResolvedValue(categoryStubs);

      const result = await service.getAll(budgetId);

      expect(result).toBeDefined();
      expect(result).toEqual(categoryResponseStubs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createOne', () => {
    it('should create a new category', async () => {
      jest
        .spyOn(budgetRepository, 'findOne')
        .mockResolvedValue(categoryStub.budget);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(categoryStub);
      jest.spyOn(repository, 'save').mockResolvedValue(categoryStub);

      const result = await service.createOne(categoryStub);

      expect(result).toEqual(categoryResponseStub);
      expect(repository.save).toHaveBeenCalledWith(categoryStub);
    });

    it('should throw a NotFoundException if category does not exist', async () => {
      jest.spyOn(budgetRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOne(categoryStub)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if category with the same name already exists', async () => {
      const budget = categoryStub.budget;
      jest.spyOn(budgetRepository, 'findOne').mockResolvedValue(budget);
      jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub);

      await expect(service.createOne(categoryStub)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing category', async () => {
      const updatedCategory: Category = {
        ...categoryStub,
        title: 'Updated Category',
      };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(categoryStub)
        .mockResolvedValueOnce(categoryStub)
        .mockResolvedValueOnce(null);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedCategory);

      const result = await service.updateOne(
        categoryStub.budgetId,
        updatedCategory,
      );
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        ...categoryResponseStub,
        title: 'Updated Category',
      });
      expect(repository.save).toHaveBeenCalledWith(categoryStub);
    });

    it('should throw a NotFoundException if category does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOne(categoryStub.id, categoryStub),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException if another category with the same name already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub);

      await expect(
        service.updateOne(categoryStub.id, categoryStub),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteOne', () => {
    it('should delete an existing category', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(categoryStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(categoryStub.id);
    });

    it('should throw a NotFoundException if category does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(categoryStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
