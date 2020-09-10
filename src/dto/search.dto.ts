import {ValidateIf, IsNotEmpty, IsDefined} from 'class-validator'

export class SearchDataDto {
    @ValidateIf(o => !parseInt(o))
    pageNumber: string

    @ValidateIf(o => !parseInt(o))
    pageSize: string


    sortOrder: string

    @IsDefined()
    sortColumn: string

    @IsDefined()
    keyword: string

    @IsDefined()
    filterColumn: string

    @IsDefined()
    filterKeys: string
  }