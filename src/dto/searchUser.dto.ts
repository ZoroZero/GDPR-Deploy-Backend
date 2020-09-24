import { IsNumber, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class SearchUserDto {
  @ValidateIf(o => !parseInt(o))
  PageNo: number;

  @ValidateIf(o => !parseInt(o))
  PageSize: number;

  @IsOptional()
  SortBy: string;

  @IsOptional()
  SortOrder: string;

  @IsOptional()
  SearchKey: string;

  @IsOptional()
  Role: string;

  @IsOptional()
  IsActive: boolean;

  // @IsNotEmpty()
  // sortColumn: string

  // @IsNotEmpty()
  // keyword: string
}
