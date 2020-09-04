import { IsUUID, isUUID } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateCustomerDto {
  FirstName: string;
  LastName: string;
  ContractBeginDate: Date;

  ContractEndDate: Date;

  Description: string;

  IsActive: boolean;

  ContactPointID: string;
}
