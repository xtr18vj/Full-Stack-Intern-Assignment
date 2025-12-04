import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}
