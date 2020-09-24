import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  Id: string;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;

  @Column()
  RoleId: string;

  @Column()
  Email: string;
  @Column()
  IsDeleted: boolean;
  @Column()
  UpdatedDate: Date;

  @Column({ default: true })
  IsActive: boolean;
}
