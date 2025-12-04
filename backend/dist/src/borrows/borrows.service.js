"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BorrowsService = class BorrowsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async borrowBook(borrowBookDto) {
        const { userId, bookId, dueAt } = borrowBookDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const book = await this.prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${bookId} not found`);
        }
        if (book.available <= 0) {
            throw new common_1.BadRequestException('Book is not available for borrowing');
        }
        const existingBorrow = await this.prisma.borrow.findFirst({
            where: {
                userId,
                bookId,
                returnedAt: null,
            },
        });
        if (existingBorrow) {
            throw new common_1.BadRequestException('User already has this book borrowed');
        }
        const dueDate = dueAt ? new Date(dueAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const borrow = await this.prisma.$transaction(async (tx) => {
            await tx.book.update({
                where: { id: bookId },
                data: { available: { decrement: 1 } },
            });
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
    async returnBook(returnBookDto) {
        const { borrowId } = returnBookDto;
        const borrow = await this.prisma.borrow.findUnique({
            where: { id: borrowId },
            include: { book: true },
        });
        if (!borrow) {
            throw new common_1.NotFoundException(`Borrow record with ID ${borrowId} not found`);
        }
        if (borrow.returnedAt) {
            throw new common_1.BadRequestException('Book has already been returned');
        }
        const updatedBorrow = await this.prisma.$transaction(async (tx) => {
            await tx.book.update({
                where: { id: borrow.bookId },
                data: { available: { increment: 1 } },
            });
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
    async findByUser(userId, includeReturned = false) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const where = { userId };
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
    async findAll(includeReturned = false) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Borrow record with ID ${id} not found`);
        }
        return borrow;
    }
};
exports.BorrowsService = BorrowsService;
exports.BorrowsService = BorrowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BorrowsService);
//# sourceMappingURL=borrows.service.js.map