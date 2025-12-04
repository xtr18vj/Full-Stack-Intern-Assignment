import { BorrowsService } from './borrows.service';
import { BorrowBookDto, ReturnBookDto } from './dto';
export declare class BorrowsController {
    private readonly borrowsService;
    constructor(borrowsService: BorrowsService);
    borrowBook(borrowBookDto: BorrowBookDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        book: {
            id: number;
            isbn: string;
            title: string;
        };
    } & {
        id: number;
        returnedAt: Date | null;
        userId: number;
        bookId: number;
        borrowedAt: Date;
        dueAt: Date;
    }>;
    returnBook(returnBookDto: ReturnBookDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        book: {
            id: number;
            isbn: string;
            title: string;
        };
    } & {
        id: number;
        returnedAt: Date | null;
        userId: number;
        bookId: number;
        borrowedAt: Date;
        dueAt: Date;
    }>;
    findAll(includeReturned?: string): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
        book: {
            id: number;
            author: {
                id: number;
                name: string;
            };
            isbn: string;
            title: string;
        };
    } & {
        id: number;
        returnedAt: Date | null;
        userId: number;
        bookId: number;
        borrowedAt: Date;
        dueAt: Date;
    })[]>;
    findByUser(userId: number, includeReturned?: string): Promise<({
        book: {
            author: {
                id: number;
                name: string;
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
        };
    } & {
        id: number;
        returnedAt: Date | null;
        userId: number;
        bookId: number;
        borrowedAt: Date;
        dueAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        book: {
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
        };
    } & {
        id: number;
        returnedAt: Date | null;
        userId: number;
        bookId: number;
        borrowedAt: Date;
        dueAt: Date;
    }>;
}
