import {
  IsNumber,
  IsNotEmpty,
  IsDefined,
  IsInt,
  ValidateIf,
  IsDate,
} from 'class-validator';

export class exportQueryDto {
  fromDate: Date;

  toDate: Date;

  approvedBy: string;

  createdBy: string;

  server: Array<string>;
}
