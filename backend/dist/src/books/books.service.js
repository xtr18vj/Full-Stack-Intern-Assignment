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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BooksService = class BooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookDto) {
        const author = await this.prisma.author.findUnique({
            where: { id: createBookDto.authorId },
        });
        if (!author) {
            throw new common_1.BadRequestException(`Author with ID ${createBookDto.authorId} not found`);
        }
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
    async findAll(filterDto) {
        const { search, authorId, available, page = 1, limit = 10 } = filterDto;
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async update(id, updateBookDto) {
        await this.findOne(id);
        if (updateBookDto.authorId) {
            const author = await this.prisma.author.findUnique({
                where: { id: updateBookDto.authorId },
            });
            if (!author) {
                throw new common_1.BadRequestException(`Author with ID ${updateBookDto.authorId} not found`);
            }
        }
        const data = { ...updateBookDto };
        if (data.publishedAt) {
            data.publishedAt = new Date(data.publishedAt);
        }
        return this.prisma.book.update({
            where: { id },
            data,
            include: { author: true },
        });
    }
    async remove(id) {
        const book = await this.findOne(id);
        if (book.borrows && book.borrows.length > 0) {
            throw new common_1.BadRequestException('Cannot delete book with active borrows');
        }
        return this.prisma.book.delete({
            where: { id },
        });
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map