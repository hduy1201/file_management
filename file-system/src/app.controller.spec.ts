import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { FileSystemService } from './services/file_system/file_system.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PrismaService, FileSystemService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        appController.exploreByNodeId('75676295-4516-45ef-aae6-4a403790a77a'),
      ).toBe({
        id: '75676295-4516-45ef-aae6-4a403790a77a',
        name: 'root',
        parent_id: null,
        is_directory: true,
        children: [
          {
            id: 'f9d6d0a3-8c1c-4f5e-8c6b-7c4c2e7f8b5d',
            name: 'child1',
            parent_id: '75676295-4516-45ef-aae6-4a403790a77a',
            is_directory: false,
            children: [],
          },
          {
            id: 'f9d6d0a3-8c1c-4f5e-8c6b-7c4c2e7f8b5d',
            name: 'child2',
            parent_id: '75676295-4516-45ef-aae6-4a403790a77a',
            is_directory: true,
            children: [
              {
                id: 'f9d6d0a3-8c1c-4f5e-8c6b-7c4c2e7f8b5d',
                name: 'child21',
                parent_id: 'f9d6d0a3-8c1c-4f5e-8c6b-7c4c2e7f8b5d',
                is_directory: true,
                children: [],
              },
            ],
          },
        ],
      });
    });
  });
});
