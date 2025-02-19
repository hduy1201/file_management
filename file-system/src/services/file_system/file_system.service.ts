import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FSTreeModel } from '../../models/file-system-tree.model';

@Injectable()
export class FileSystemService {
  constructor(private prisma: PrismaService) {}

  async calculateDepth(nodeId: string) {
    let depth = 0;
    let currentId: string | null | undefined = nodeId;
    const maxOfDepth = 1024;
    while (currentId !== null) {
      depth++;
      if (depth > maxOfDepth) {
        throw new Error('Depth is too big');
      }
      currentId = await this.prisma.file_system
        .findUnique({ where: { id: currentId } })
        .then((node) => node?.parent_id);
      if (currentId == null) {
        return depth;
      }
    }
    return depth;
  }

  async isDirectory(nodeId: string) {
    let childrenCount = await this.prisma.file_system.count({
      where: { parent_id: nodeId },
    });
    return childrenCount > 0;
  }

  async explore(parentId: string | undefined) {
    let currentNode;
    if (parentId != undefined) {
      currentNode = await this.prisma.file_system.findUnique({
        where: { id: parentId },
      });
      if (currentNode == null) {
        throw new Error('Node not found');
      }
    }
    let currentDepth = 0;
    if (parentId != null) {
      let currentDepth = await this.calculateDepth(parentId);
    }
    let children;
    if (parentId == undefined) {
      // get children with parent_id = null
      children = await this.prisma.file_system.findMany({
        where: { parent_id: null },
      });
    } else {
      children = await this.prisma.file_system.findMany({
        where: { parent_id: parentId },
      });
    }

    let actualChildren: FSTreeModel[] = [];
    for (let child of children) {
      let isDirectory = await this.isDirectory(child.id);
      let tree: FSTreeModel = {
        id: child.id,
        name: child.name,
        isDirectory: isDirectory,
        depth: currentDepth + 1,
        children: [],
      };
      actualChildren.push(tree);
    }
    if (parentId == undefined) {
      return <FSTreeModel>{
        id: '00000000-0000-0000-0000-000000000000',
        name: 'root',
        isDirectory: true,
        depth: 0,
        children: actualChildren,
      };
    }
    let tree: FSTreeModel = {
      id: currentNode.id,
      name: currentNode.name,
      isDirectory: children.length != 0,
      depth: currentDepth,
      children: actualChildren,
    };
    return tree;
  }

  async createNode(name: string, parentId: string | null) {
    let newNode = await this.prisma.file_system.create({
      data: {
        name: name,
        parent_id: parentId,
      },
    });
    return newNode;
  }

  async deleteNode(nodeId: string) {
    let node = await this.prisma.file_system.findUnique({
      where: { id: nodeId },
    });
    if (node == null) {
      throw new Error('Node not found');
    }
    // delete all children recursively
    let children = await this.prisma.file_system.findMany({
      where: { parent_id: nodeId },
    });
    for (let child of children) {
      await this.deleteNode(child.id);
    }
    await this.prisma.file_system.delete({
      where: { id: nodeId },
    });
  }

  async renameNode(nodeId: string, newName: string) {
    let node = await this.prisma.file_system.findUnique({
      where: { id: nodeId },
    });
    if (node == null) {
      throw new Error('Node not found');
    }
    console.log(node);
    let res = await this.prisma.file_system.update({
      where: { id: nodeId },
      data: { name: newName },
    });
    return res;
  }
}
