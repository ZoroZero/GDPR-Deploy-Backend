import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Server } from 'src/servers/server.entity';

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
  @Column('uuid')
  CreatedBy: string;
  @Column('uuid')
  UpdatedBy: string;
  @Column()
  UpdatedDate: Date;
  @Column()
  Description: string;
  @Column('uuid')
  DeletedBy: string;
  @Column()
  DeletedDate: Date;

  @Column()
  IsDeleted: boolean;

  @OneToMany(
    type => Server,
    servers=> servers.customer
  )
  servers: Server[]
}
