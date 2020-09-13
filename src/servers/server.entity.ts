import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Server')
export class Server {
  @PrimaryGeneratedColumn()
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

  @Column('uuid')
  CreatedBy: Date

  @Column()
  UpdatedDate: Date

  @Column('uuid')
  UpdatedBy: Date

  @Column()
  DeletedDate: Date

  @Column('uuid')
  DeletedBy: Date

  @Column({ default: false })
  IsDeleted: boolean;
}
