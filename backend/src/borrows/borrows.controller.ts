import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowBookDto, ReturnBookDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';

@Controller('borrows')
@UseGuards(JwtAuthGuard)
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post('borrow')
  borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowsService.borrowBook(borrowBookDto);
  }

  @Post('return')
  returnBook(@Body() returnBookDto: ReturnBookDto) {
    return this.borrowsService.returnBook(returnBookDto);
  }

  @Get()
  findAll(@Query('includeReturned') includeReturned?: string) {
    return this.borrowsService.findAll(includeReturned === 'true');
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('includeReturned') includeReturned?: string,
  ) {
    return this.borrowsService.findByUser(userId, includeReturned === 'true');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.findOne(id);
  }
}
