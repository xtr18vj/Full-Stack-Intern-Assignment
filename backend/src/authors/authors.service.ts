import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: createAuthorDto,
      include: { books: true },
    });
  }

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { bio: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.author.findMany({
      where,
      include: {
        books: {
          select: {
            id: true,
            title: true,
            isbn: true,
          },
        },
        _count: {
          select: { books: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
      include: { books: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.author.delete({
      where: { id },
    });
  }
}
