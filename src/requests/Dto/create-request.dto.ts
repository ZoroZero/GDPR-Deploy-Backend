import {
  IsNumber,
  IsNotEmpty,
  IsDefined,
  IsInt,
  ValidateIf,
  IsDate,
} from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  title: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsDefined()
  description: string;

  @IsNotEmpty()
  server: string;
}
