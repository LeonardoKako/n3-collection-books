import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(80)
  @MinLength(1)
  title: string;

  @IsInt()
  @Min(1)
  @Max(2026)
  year: number;

  @IsString()
  @MaxLength(80)
  @MinLength(1)
  author: string;
}
