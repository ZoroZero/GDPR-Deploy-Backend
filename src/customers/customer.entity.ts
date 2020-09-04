import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column('uuid')
  ContactPointId: string;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;
  @Column()
  ContractBeginDate: Date;
  @Column()
  ContractEndDate: Date;
  @Column()
  IsActive: boolean;

  @Column()
  UpdatedDate: Date;
  @Column()
  Description: string;
  @Column()
  IsDeleted: boolean;
}
