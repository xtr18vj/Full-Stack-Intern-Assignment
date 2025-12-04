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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowsController = void 0;
const common_1 = require("@nestjs/common");
const borrows_service_1 = require("./borrows.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
let BorrowsController = class BorrowsController {
    borrowsService;
    constructor(borrowsService) {
        this.borrowsService = borrowsService;
    }
    borrowBook(borrowBookDto) {
        return this.borrowsService.borrowBook(borrowBookDto);
    }
    returnBook(returnBookDto) {
        return this.borrowsService.returnBook(returnBookDto);
    }
    findAll(includeReturned) {
        return this.borrowsService.findAll(includeReturned === 'true');
    }
    findByUser(userId, includeReturned) {
        return this.borrowsService.findByUser(userId, includeReturned === 'true');
    }
    findOne(id) {
        return this.borrowsService.findOne(id);
    }
};
exports.BorrowsController = BorrowsController;
__decorate([
    (0, common_1.Post)('borrow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BorrowBookDto]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "borrowBook", null);
__decorate([
    (0, common_1.Post)('return'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReturnBookDto]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "returnBook", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeReturned')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('includeReturned')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BorrowsController.prototype, "findOne", null);
exports.BorrowsController = BorrowsController = __decorate([
    (0, common_1.Controller)('borrows'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [borrows_service_1.BorrowsService])
], BorrowsController);
//# sourceMappingURL=borrows.controller.js.map