import { IsNumber, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateUserDto {
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

  @IsOptional()
  IsActive: boolean;

  // @IsNotEmpty()
  // sortColumn: string

  // @IsNotEmpty()
  // keyword: string
}
