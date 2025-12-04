import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(search?: string): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        _count: {
            borrows: number;
        };
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        borrows: ({
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
        })[];
        _count: {
            borrows: number;
        };
    }>;
}
