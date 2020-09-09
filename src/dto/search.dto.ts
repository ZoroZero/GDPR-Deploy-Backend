import {
  IsNumber,
  IsNotEmpty,
  IsDefined,
  IsInt,
  ValidateIf,
} from 'class-validator';

export class SearchDataDto {
  @ValidateIf(o => (parseInt(o) ? true : false))
  pageNumber: number;
  @ValidateIf(o => (parseInt(o) ? true : false))
  pageSize: number;

  sortOrder: string;
  @IsDefined()
  sortColumn: string;
  @IsDefined()
  keyword: string;
}
