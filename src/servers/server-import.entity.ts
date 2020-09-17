import { IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
export class ServerInformation {

    Name: string;

    IpAddress: string;
  
    StartDate: Date;
  
    EndDate: Date;
  
    IsActive: boolean;
  
    CreatedDate: Date

    @IsUUID()
    CreatedBy: string
  
    UpdatedDate?: Date
  
    UpdatedBy?: string

    DeletedDate?: Date

    DeletedBy?: string

    IsDeleted: boolean;
}
  