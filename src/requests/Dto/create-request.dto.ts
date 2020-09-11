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

  startDate: Date;

  endDate: Date;

  @IsDefined()
  description: string;

  @IsNotEmpty()
  server: string;
}
