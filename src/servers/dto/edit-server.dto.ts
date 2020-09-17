import { IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


export class EditServerDto {
  @IsUUID()
  Id: string;

  Name: string;

  IpAddress: string;

  StartDate: Date;

  EndDate: Date;

  IsActive: boolean;
}