import { IsUUID } from 'class-validator';

export class CreateCustomerDto {
  FirstName: string;
  LastName: string;
  ContractBeginDate: Date;

  ContractEndDate: Date;

  Description: string;

  IsActive: boolean;

  @IsUUID()
  ContactPointID: string;
}
