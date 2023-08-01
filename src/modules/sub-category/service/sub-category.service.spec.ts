import { Repository } from 'typeorm';
import {
  SubCategory,
  stubSubCategory,
  stubSubCategoryResponse,
} from '../entities';
import { SubCategoryService } from './sub-category.service';
import { Category } from '../../category/entities';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const subCategoryResponseStub = stubSubCategoryResponse();
const subCategoryResponseStubs = [subCategoryResponseStub];

const subCategoryStub = stubSubCategory();
const subCategoryStubs = [subCategoryStub];

describe('SubCategoryService', () => {
  let service: SubCategoryService;
  let repository: Repository<SubCategory>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubCategoryService,
        {
          provide: getRepositoryToken(SubCategory),
          useValue: {
            findOne: jest.fn().mockResolvedValue(subCategoryStub),
            save: jest.fn().mockResolvedValue(subCategoryStub),
            find: jest.fn().mockResolvedValue(subCategoryStub),
            create: jest.fn().mockResolvedValue(subCategoryStub),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<SubCategoryService>(SubCategoryService);
    repository = moduleRef.get<Repository<SubCategory>>(
      getRepositoryToken(SubCategory),
    );
    categoryRepository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all sub categories for a given budget', async () => {
      const categoryId = subCategoryStub.categoryId;
      jest.spyOn(repository, 'find').mockResolvedValue(subCategoryStubs);

      const result = await service.getAll(categoryId);

      expect(result).toEqual(subCategoryResponseStubs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createOne', () => {
    it('should create a new subcategory', async () => {
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(subCategoryStub.category);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(subCategoryStub);
      jest.spyOn(repository, 'save').mockResolvedValue(subCategoryStub);

      const result = await service.createOne(subCategoryStub);

      expect(result).toEqual(subCategoryResponseStub);
      expect(repository.save).toHaveBeenCalledWith(subCategoryStub);
    });

    it('should throw a NotFoundException if subcategory does not exist', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOne(subCategoryStub)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if subcategory with the same name already exists', async () => {
      const category = subCategoryStub.category;
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(repository, 'findOne').mockResolvedValue(subCategoryStub);

      await expect(service.createOne(subCategoryStub)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing subcategory', async () => {
      const updatedSubCategory: SubCategory = {
        ...subCategoryStub,
        title: 'Updated SubCategory',
      };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(subCategoryStub)
        .mockResolvedValueOnce(subCategoryStub)
        .mockResolvedValueOnce(null);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedSubCategory);

      const result = await service.updateOne(
        subCategoryStub.categoryId,
        updatedSubCategory,
      );
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        ...subCategoryResponseStub,
        title: 'Updated SubCategory',
      });
      expect(repository.save).toHaveBeenCalledWith(subCategoryStub);
    });

    it('should throw a NotFoundException if subcategory does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOne(subCategoryStub.id, subCategoryStub),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException if another subcategory with the same name already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(subCategoryStub);

      await expect(
        service.updateOne(subCategoryStub.id, subCategoryStub),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteOne', () => {
    it('should delete an existing subcategory', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(subCategoryStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(subCategoryStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(subCategoryStub.id);
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(subCategoryStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
