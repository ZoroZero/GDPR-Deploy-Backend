import {IsNumber, IsNotEmpty} from 'class-validator'

export class SearchDataDto {
    @IsNumber()
    pageNumber: number

    @IsNumber()
    pageSize: number

    
    sortOrder: string

    @IsNotEmpty()
    sortColumn: string

    @IsNotEmpty()
    keyword: string
  }