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
exports.AuthorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthorsService = class AuthorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAuthorDto) {
        return this.prisma.author.create({
            data: createAuthorDto,
            include: { books: true },
        });
    }
    async findAll(search) {
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { bio: { contains: search, mode: 'insensitive' } },
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Author with ID ${id} not found`);
        }
        return author;
    }
    async update(id, updateAuthorDto) {
        await this.findOne(id);
        return this.prisma.author.update({
            where: { id },
            data: updateAuthorDto,
            include: { books: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.author.delete({
            where: { id },
        });
    }
};
exports.AuthorsService = AuthorsService;
exports.AuthorsService = AuthorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthorsService);
//# sourceMappingURL=authors.service.js.map