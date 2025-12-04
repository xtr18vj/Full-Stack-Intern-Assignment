import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto, BookFilterDto } from './dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Verify author exists
    const author = await this.prisma.author.findUnique({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new BadRequestException(`Author with ID ${createBookDto.authorId} not found`);
    }

    // Convert date string to proper DateTime
    const publishedAt = createBookDto.publishedAt 
      ? new Date(createBookDto.publishedAt) 
      : undefined;

    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        isbn: createBookDto.isbn,
        description: createBookDto.description,
        publishedAt,
        quantity: createBookDto.quantity || 1,
        authorId: createBookDto.authorId,
        available: createBookDto.quantity || 1,
      },
      include: { author: true },
    });
  }

  async findAll(filterDto: BookFilterDto) {
    const { search, authorId, available, page = 1, limit = 10 } = filterDto;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (available !== undefined) {
      where.available = available ? { gt: 0 } : { equals: 0 };
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { borrows: true },
          },
        },
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrows: {
          where: { returnedAt: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id); // Check if exists

    if (updateBookDto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new BadRequestException(`Author with ID ${updateBookDto.authorId} not found`);
      }
    }

    // Convert date string to proper DateTime if provided
    const data: any = { ...updateBookDto };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async remove(id: number) {
    const book = await this.findOne(id);

    // Check if book has active borrows
    if (book.borrows && book.borrows.length > 0) {
      throw new BadRequestException('Cannot delete book with active borrows');
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
