import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(17)
  isbn: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  quantity?: number;

  @IsInt()
  @Type(() => Number)
  authorId: number;
}
