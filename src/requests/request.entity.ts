import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  OneToOne,
} from 'typeorm';
import { Server } from '../servers/server.entity';
import { User } from 'src/users/user.entity';

@Entity('Request')
export class Request {
  @PrimaryGeneratedColumn()
  Id: string;

  @Column()
  CreatedDate: Date;

  @Column()
  CreatedBy: string;

  @Column()
  UpdatedDate: Date;

  @Column()
  UpdatedBy: string;

  @Column()
  DeletedDate: Date;

  @Column()
  DeletedBy: string;

  @Column()
  IsDeleted: boolean;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @Column()
  Title: string;

  @Column()
  Description: string;

  @Column()
  IsApproved: boolean;

  @Column()
  ServerId: string;

  @Column()
  ApprovedBy: string;

  @Column()
  ApprovedDate: Date;

  @Column()
  IsActive: boolean;

  @Column()
  IsOpen: boolean;
}
