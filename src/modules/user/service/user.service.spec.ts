import { Repository } from 'typeorm';
import { User, stubUser } from '../../auth/entities';
import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const userStub = stubUser();
const userStubs = [userStub];

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userStub),
            find: jest.fn().mockResolvedValue(userStub),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteOne', () => {
    it('should delete an existing user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(userStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(userStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(userStub.id);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(userStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
