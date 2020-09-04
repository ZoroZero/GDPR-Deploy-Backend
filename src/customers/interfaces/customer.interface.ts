export interface Customer {
  Id: string;

  ContactPointId: string;

  FirstName: string;

  LastName: string;
  ContractBeginDate: Date;
  ContractEndDate: Date;
  IsActive: boolean;

  UpdatedDate: Date;

  IsDeleted: boolean;
}
