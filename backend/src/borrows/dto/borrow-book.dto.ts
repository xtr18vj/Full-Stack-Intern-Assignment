import { IsInt, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BorrowBookDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsInt()
  @Type(() => Number)
  bookId: number;

  @IsDateString()
  @IsOptional()
  dueAt?: string;
}
