import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Server')
export class Server {
  @PrimaryGeneratedColumn()
  Id: string;

  @Column()
  Name: string;

  @Column({length: 15})
  IpAddress: string;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @Column()
  IsDeleted: boolean;

  @Column({ default: true })
  IsActive: boolean;
}
