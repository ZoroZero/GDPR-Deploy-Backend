import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('ErrorLog')
export class ErrorLog {
  @PrimaryColumn('uuid')
  CreatedBy: string;

  @PrimaryColumn()
  CreatedDate: Date;

  @Column()
  Detail: string;

  @Column()
  General: string;
}
