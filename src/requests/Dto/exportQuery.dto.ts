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

  approvedBy: Array<string>;

  createdBy: Array<string>;

  server: Array<string>;
}
