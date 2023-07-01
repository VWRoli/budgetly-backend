import { Repository } from 'typeorm';
import { SubCategory, stubSubCategory } from '../entities';
import { SubCategoryService } from '../service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { SubCategoryController } from './index';
import { Category } from '../../category/entities';

const subCategoryStub = stubSubCategory();
const subCategoryStubs = [subCategoryStub];

describe('SubCategoryController', () => {
  let controller: SubCategoryController;
  let service: SubCategoryService;
  let repository: Repository<SubCategory>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot({})],
      controllers: [SubCategoryController],
      providers: [
        SubCategoryService,
        {
          provide: getRepositoryToken(SubCategory),
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

    service = moduleRef.get<SubCategoryService>(SubCategoryService);
    controller = moduleRef.get<SubCategoryController>(SubCategoryController);
    repository = moduleRef.get<Repository<SubCategory>>(
      getRepositoryToken(SubCategory),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSubCategorys', () => {
    it('should return an array of sub categorys', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(subCategoryStubs);
      const result = await controller.getSubCategorys(
        subCategoryStub.categoryId,
      );

      expect(result).toEqual(subCategoryStubs);
    });
  });

  describe('createSubCategory', () => {
    it('should create a new sub category', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(subCategoryStub);
      const result = await controller.createSubCategory(subCategoryStub);

      expect(result).toEqual(subCategoryStub);
    });
  });

  describe('updateSubCategory', () => {
    it('should update an existing sub category', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(subCategoryStub);
      const result = await controller.updateSubCategory(
        subCategoryStub.id,
        subCategoryStub,
      );

      expect(result).toEqual(subCategoryStub);
    });
  });

  describe('deleteSubCategory', () => {
    it('should delete an existing sub category', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteSubCategory(subCategoryStub.id);

      expect(result).toBeUndefined();
    });
  });
});
