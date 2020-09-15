// import { IsUUID, isUUID, IsEmail } from 'class-validator';
// import { IsNull } from 'typeorm';

import { IsEmail } from "class-validator";

export class ExportCustomerDto {
  CustomerName?: string;

  ContactPointEmail?: string;

  ContractBeginDate?: Date;

  ContractEndDate?: Date;

  IsActive: string;
}
