// import { IsUUID, isUUID, IsEmail } from 'class-validator';
// import { IsNull } from 'typeorm';

// import { IsEmail } from "class-validator";

export class ExportCustomerDto {
  CustomerName?: string;

  ContactPoint?: string;

  ContractBeginDate?: Date;

  ContractEndDate?: Date;

  IsActive: string;
}
