import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Customer } from 'src/customers/customer.entity';
import { CustomerServer } from 'src/customer-servers/customer-server.entity';

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

  @Column()
  IsDeleted: boolean;

  @Column({ default: true })
  IsActive: boolean;
  @OneToOne(
    type => CustomerServer,
    CustomerServer => CustomerServer.Server,
  )
  CustomerServer: CustomerServer;
}
