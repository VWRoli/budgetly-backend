import { Test } from '@nestjs/testing';
import { User, stubUser } from '../../auth/entities';
import { UserController } from './user.controller';
import { UserService } from '../service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const userStub = stubUser();

const repositoryMock = {
  findOne: jest.fn(),
  softDelete: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    controller = moduleRef.get<UserController>(UserController);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteOne', () => {
    it('should delete the user with the provided id', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userStub);
      const softDeleteSpy = jest.spyOn(userRepository, 'softDelete');

      await service.deleteOne(userStub.id);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: userStub.id } });
      expect(softDeleteSpy).toHaveBeenCalledWith(userStub.id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.deleteOne(userStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should rethrow any caught error', async () => {
      const errorMessage = 'Something went wrong.';
      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.deleteOne(userStub.id)).rejects.toThrowError(
        errorMessage,
      );
    });
  });
});
