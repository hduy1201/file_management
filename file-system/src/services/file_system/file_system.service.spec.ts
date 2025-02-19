import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemService } from './file_system.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FileSystemService', () => {
  let service: FileSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemService, PrismaService],
    }).compile();

    service = module.get<FileSystemService>(FileSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate depth', async () => {
    expect(await service.calculateDepth('1')).toBe(1);
  });

  it('should check if directory', async () => {
    expect(await service.isDirectory('1')).toBe(true);
  });

  it('should explore', async () => {
    expect(
      await service.explore('75676295-4516-45ef-aae6-4a403790a77a'),
    ).toEqual({
      id: '75676295-4516-45ef-aae6-4a403790a77a',
      name: 'system management',
      isDirectory: true,
      depth: 1,
      children: [],
    });
  });

  it('should create node', async () => {
    expect(
      await service.createNode('lulu', '75676295-4516-45ef-aae6-4a403790a77a'),
    ).toBeDefined();
  });

  it('should delete node', async () => {
    expect(
      await service.deleteNode('75676295-4516-45ef-aae6-4a403790a77a'),
    ).toHaveBeenCalled();
  });

  it('should rename node', () => {
    expect(
      service.renameNode('10ad38ca-aa66-4c19-a8f3-368ff389c906', 'lulu duc'),
    ).toEqual({
      id: '75676295-4516-45ef-aae6-4a403790a77a',
      name: 'lulu duc',
      isDirectory: false,
      depth: 1,
      children: [],
    });
  });
});
