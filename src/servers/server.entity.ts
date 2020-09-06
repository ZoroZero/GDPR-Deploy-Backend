import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Customer } from 'src/customers/customer.entity';

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
  @ManyToOne(
    type=>Customer,
    customer=> customer.servers
  )
  customer: Customer
}
