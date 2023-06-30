import { Repository } from 'typeorm';
import { Category, stubCategory } from '../entities';
import { CategoryService } from '../service';
import { CategoryController } from './category.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Budget } from '../../budget/entities';

const categoryStub = stubCategory();
const categoryStubs = [categoryStub];

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot({})],
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Budget),
          useValue: jest.fn(),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<CategoryService>(CategoryService);
    controller = moduleRef.get<CategoryController>(CategoryController);
    repository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return an array of categories', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(categoryStubs);
      const result = await controller.getCategories(categoryStub.budgetId);

      expect(result).toEqual(categoryStubs);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(categoryStub);
      const result = await controller.createCategory(categoryStub);

      expect(result).toEqual(categoryStub);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(categoryStub);
      const result = await controller.updateCategory(
        categoryStub.id,
        categoryStub,
      );

      expect(result).toEqual(categoryStub);
    });
  });

  describe('deleteCategory', () => {
    it('should delete an existing category', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteCategory(categoryStub.id);

      expect(result).toBeUndefined();
    });
  });
});
