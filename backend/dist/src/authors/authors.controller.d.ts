import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    create(createAuthorDto: CreateAuthorDto): Promise<{
        books: {
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
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
    }>;
    findAll(search?: string): Promise<({
        books: {
            id: number;
            isbn: string;
            title: string;
        }[];
        _count: {
            books: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
    })[]>;
    findOne(id: number): Promise<{
        books: {
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
        }[];
        _count: {
            books: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
    }>;
    update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<{
        books: {
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
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
    }>;
}
