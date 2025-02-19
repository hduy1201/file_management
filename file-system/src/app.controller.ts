import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileSystemService } from './services/file_system/file_system.service';
import { FSTreeModel } from './models/file-system-tree.model';

@Controller()
export class AppController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @Get('explore/:id')
  async exploreByNodeId(@Param('id') id: string): Promise<FSTreeModel> {
    return await this.fileSystemService.explore(id);
  }

  @Get('explore')
  async exploreAll(@Param('id') id: string): Promise<FSTreeModel> {
    return await this.fileSystemService.explore(undefined);
  }

  @Post('add')
  async createNewNode(
    @Body() fileSystemData: { name: string; parent_id: string },
  ) {
    return await this.fileSystemService.createNode(
      fileSystemData.name,
      fileSystemData.parent_id,
    );
  }

  @Put('rename')
  async renameNode(
    @Body() fileSystemData: { name: string; id: string },
  ) {
    return this.fileSystemService.renameNode(
      fileSystemData.id,
      fileSystemData.name,
    );
  }

  @Delete('delete/:id')
  async deleteNode(@Param('id') id: string) {
    return this.fileSystemService.deleteNode(id);
  }
}
