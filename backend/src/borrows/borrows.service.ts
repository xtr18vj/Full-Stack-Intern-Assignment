import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto, ReturnBookDto } from './dto';

@Injectable()
export class BorrowsService {
  constructor(private readonly prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const { userId, bookId, dueAt } = borrowBookDto;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify book exists and is available
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (book.available <= 0) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Check if user already has this book borrowed
    const existingBorrow = await this.prisma.borrow.findFirst({
      where: {
        userId,
        bookId,
        returnedAt: null,
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('User already has this book borrowed');
    }

    // Create borrow and update book availability in a transaction
    const dueDate = dueAt ? new Date(dueAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Default 14 days

    const borrow = await this.prisma.$transaction(async (tx) => {
      // Decrement available count
      await tx.book.update({
        where: { id: bookId },
        data: { available: { decrement: 1 } },
      });

      // Create borrow record
      return tx.borrow.create({
        data: {
          userId,
          bookId,
          dueAt: dueDate,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
            },
          },
        },
      });
    });

    return borrow;
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    const { borrowId } = returnBookDto;

    // Find the borrow record
    const borrow = await this.prisma.borrow.findUnique({
      where: { id: borrowId },
      include: { book: true },
    });

    if (!borrow) {
      throw new NotFoundException(`Borrow record with ID ${borrowId} not found`);
    }

    if (borrow.returnedAt) {
      throw new BadRequestException('Book has already been returned');
    }

    // Update borrow and book availability in a transaction
    const updatedBorrow = await this.prisma.$transaction(async (tx) => {
      // Increment available count
      await tx.book.update({
        where: { id: borrow.bookId },
        data: { available: { increment: 1 } },
      });

      // Mark as returned
      return tx.borrow.update({
        where: { id: borrowId },
        data: { returnedAt: new Date() },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
            },
          },
        },
      });
    });

    return updatedBorrow;
  }

  async findByUser(userId: number, includeReturned: boolean = false) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const where: any = { userId };
    if (!includeReturned) {
      where.returnedAt = null;
    }

    return this.prisma.borrow.findMany({
      where,
      include: {
        book: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });
  }

  async findAll(includeReturned: boolean = false) {
    const where = includeReturned ? {} : { returnedAt: null };

    return this.prisma.borrow.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const borrow = await this.prisma.borrow.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!borrow) {
      throw new NotFoundException(`Borrow record with ID ${id} not found`);
    }

    return borrow;
  }
}
