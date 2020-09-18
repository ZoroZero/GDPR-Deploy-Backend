import { IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Generated, BeforeInsert } from 'typeorm';

@Entity('Server')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  @Generated("uuid")
  Id: string;

  @Column()
  Name: string;

  @Column({ length: 15 })
  IpAddress: string;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @Column({ default: true })
  IsActive: boolean;

  @Column()
  CreatedDate: Date
  
  @IsUUID()
  @Column('uuid')
  CreatedBy: string

  @Column()
  UpdatedDate?: Date

  @Column('uuid')
  UpdatedBy?: string

  @Column()
  DeletedDate?: Date


  @Column('uuid')
  DeletedBy?: string

  @Column({ default: false })
  IsDeleted: boolean;
}
