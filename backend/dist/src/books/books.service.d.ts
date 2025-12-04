import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto, BookFilterDto } from './dto';
export declare class BooksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createBookDto: CreateBookDto): Promise<{
        author: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string;
        title: string;
        description: string | null;
        publishedAt: Date | null;
        quantity: number;
        available: number;
        authorId: number;
    }>;
    findAll(filterDto: BookFilterDto): Promise<{
        data: ({
            author: {
                id: number;
                name: string;
            };
            _count: {
                borrows: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isbn: string;
            title: string;
            description: string | null;
            publishedAt: Date | null;
            quantity: number;
            available: number;
            authorId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        borrows: ({
            user: {
                id: number;
                email: string;
                name: string;
            };
        } & {
            id: number;
            returnedAt: Date | null;
            userId: number;
            bookId: number;
            borrowedAt: Date;
            dueAt: Date;
        })[];
        author: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string;
        title: string;
        description: string | null;
        publishedAt: Date | null;
        quantity: number;
        available: number;
        authorId: number;
    }>;
    update(id: number, updateBookDto: UpdateBookDto): Promise<{
        author: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string;
        title: string;
        description: string | null;
        publishedAt: Date | null;
        quantity: number;
        available: number;
        authorId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string;
        title: string;
        description: string | null;
        publishedAt: Date | null;
        quantity: number;
        available: number;
        authorId: number;
    }>;
}
