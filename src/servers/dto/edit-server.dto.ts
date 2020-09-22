import { IsIP, IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


export class EditServerDto {
  @IsUUID()
  Id: string;

  Name: string;

  @IsIP(4)
  IpAddress: string;

  StartDate: Date;

  EndDate: Date;

  IsActive: boolean;
}