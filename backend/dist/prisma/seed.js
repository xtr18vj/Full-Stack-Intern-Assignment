"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {},
        create: {
            email: 'admin@library.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('Created admin user:', admin.email);
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@library.com' },
        update: {},
        create: {
            email: 'user@library.com',
            password: userPassword,
            name: 'John Doe',
            role: 'USER',
        },
    });
    console.log('Created regular user:', user.email);
    const authors = await Promise.all([
        prisma.author.upsert({
            where: { id: 1 },
            update: {},
            create: {
                name: 'J.K. Rowling',
                bio: 'British author best known for the Harry Potter fantasy series.',
            },
        }),
        prisma.author.upsert({
            where: { id: 2 },
            update: {},
            create: {
                name: 'George Orwell',
                bio: 'English novelist, essayist, and critic famous for his novels 1984 and Animal Farm.',
            },
        }),
        prisma.author.upsert({
            where: { id: 3 },
            update: {},
            create: {
                name: 'Jane Austen',
                bio: 'English novelist known for her social commentary and realism.',
            },
        }),
    ]);
    console.log('Created authors:', authors.map(a => a.name).join(', '));
    const books = await Promise.all([
        prisma.book.upsert({
            where: { isbn: '9780747532699' },
            update: {},
            create: {
                title: "Harry Potter and the Philosopher's Stone",
                isbn: '9780747532699',
                description: 'The first novel in the Harry Potter series.',
                publishedAt: new Date('1997-06-26'),
                quantity: 5,
                available: 5,
                authorId: 1,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '9780747538486' },
            update: {},
            create: {
                title: 'Harry Potter and the Chamber of Secrets',
                isbn: '9780747538486',
                description: 'The second novel in the Harry Potter series.',
                publishedAt: new Date('1998-07-02'),
                quantity: 3,
                available: 3,
                authorId: 1,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '9780451524935' },
            update: {},
            create: {
                title: '1984',
                isbn: '9780451524935',
                description: 'A dystopian social science fiction novel.',
                publishedAt: new Date('1949-06-08'),
                quantity: 4,
                available: 4,
                authorId: 2,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '9780451526342' },
            update: {},
            create: {
                title: 'Animal Farm',
                isbn: '9780451526342',
                description: 'An allegorical novella reflecting events leading up to the Russian Revolution.',
                publishedAt: new Date('1945-08-17'),
                quantity: 2,
                available: 2,
                authorId: 2,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '9780141439518' },
            update: {},
            create: {
                title: 'Pride and Prejudice',
                isbn: '9780141439518',
                description: 'A romantic novel of manners.',
                publishedAt: new Date('1813-01-28'),
                quantity: 3,
                available: 3,
                authorId: 3,
            },
        }),
    ]);
    console.log('Created books:', books.map(b => b.title).join(', '));
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map