import { Repository } from 'typeorm';
import { CategoryItem, stubCategoryItem } from '../entities';
import { CategoryItemService } from '../service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { CategoryItemController } from './index';
import { Category } from '../../category/entities';

const categoryItemStub = stubCategoryItem();
const categoryItemStubs = [categoryItemStub];

describe('CategoryItemController', () => {
  let controller: CategoryItemController;
  let service: CategoryItemService;
  let repository: Repository<CategoryItem>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot({})],
      controllers: [CategoryItemController],
      providers: [
        CategoryItemService,
        {
          provide: getRepositoryToken(CategoryItem),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Category),
          useValue: jest.fn(),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<CategoryItemService>(CategoryItemService);
    controller = moduleRef.get<CategoryItemController>(CategoryItemController);
    repository = moduleRef.get<Repository<CategoryItem>>(
      getRepositoryToken(CategoryItem),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategoryItems', () => {
    it('should return an array of category items', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(categoryItemStubs);
      const result = await controller.getCategoryItems(
        categoryItemStub.categoryId,
      );

      expect(result).toEqual(categoryItemStubs);
    });
  });

  describe('createCategoryItem', () => {
    it('should create a new category item', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(categoryItemStub);
      const result = await controller.createCategoryItem(categoryItemStub);

      expect(result).toEqual(categoryItemStub);
    });
  });

  describe('updateCategoryItem', () => {
    it('should update an existing category item', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(categoryItemStub);
      const result = await controller.updateCategoryItem(
        categoryItemStub.id,
        categoryItemStub,
      );

      expect(result).toEqual(categoryItemStub);
    });
  });

  describe('deleteCategoryItem', () => {
    it('should delete an existing category item', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteCategoryItem(categoryItemStub.id);

      expect(result).toBeUndefined();
    });
  });
});
