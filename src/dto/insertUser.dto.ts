import { IsNumber, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class InsertUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  // @IsNotEmpty()
  // sortColumn: string

  // @IsNotEmpty()
  // keyword: string
}
