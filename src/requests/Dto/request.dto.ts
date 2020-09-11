import { IsUUID, IsDate } from 'class-validator';

export class RequestDto {
  @IsUUID()
  Id: string;
  @IsDate()
  CreatedDate: Date;
  @IsUUID()
  CreatedBy: string;
  @IsDate()
  UpdatedDate: Date;
  @IsUUID()
  UpdatedBy: string;
  @IsDate()
  DeletedDate: Date;
  @IsUUID()
  DeletedBy: string;

  IsDeleted: boolean;
  @IsDate()
  StartDate: Date;
  @IsDate()
  EndDate: Date;

  Title: string;

  Description: string;

  IsApproved: boolean;

  ServerId: string;
  @IsUUID()
  ApprovedBy: string;
  @IsDate()
  ApprovedDate: Date;

  IsActive: boolean;

  IsOpen: boolean;
}
