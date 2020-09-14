import { IsNumber, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty()
  Email: string;

  @IsNotEmpty()
  PassWord: string;

  @IsNotEmpty()
  FirstName: string;

  @IsNotEmpty()
  LastName: string;

  @IsOptional()
  IsActive: boolean;

  // @IsNotEmpty()
  // sortColumn: string

  // @IsNotEmpty()
  // keyword: string
}
