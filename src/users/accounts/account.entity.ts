import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column('uuid')
  UserId: string;
  
  @Column()
  UserName: string;

  @Column()
  HashPasswd: string;

  @Column()
  Salt: string;

    @Column({ default: true })
    IsDeleted: boolean;
}
