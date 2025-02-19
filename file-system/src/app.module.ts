import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { FileSystemService } from './services/file_system/file_system.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, FileSystemService],
})
export class AppModule {}
