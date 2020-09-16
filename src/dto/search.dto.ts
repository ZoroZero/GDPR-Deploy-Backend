import { ValidateIf, IsNotEmpty, IsDefined } from 'class-validator';

export class SearchDataDto {
  @ValidateIf(o => !parseInt(o))
  pageNumber: string;

  @ValidateIf(o => !parseInt(o))
  pageSize: string;

  sortOrder: string;

  @IsDefined()
  sortColumn: string;

  @IsDefined()
  keyword: string;

  filterColumn: string;

  filterKeys: string;
}
