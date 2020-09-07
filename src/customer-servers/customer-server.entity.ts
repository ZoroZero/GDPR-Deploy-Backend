import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Server } from '../servers/server.entity';
import { Customer } from 'src/customers/customer.entity';
@Entity('CustomerServer')
export class CustomerServer {
  @PrimaryColumn('uuid')
  ServerId: string;

  @Column('uuid')
  CustomerId: string;
  @OneToOne(
    type => Server,
    Server => Server.CustomerServer,
  )
  Server: Server;

  @ManyToOne(
    type => Customer,
    Customer => Customer.CustomerServers,
  )
  Customer: Customer;
}
