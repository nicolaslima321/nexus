import { Entity, Column, Generated, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Survivor } from './survivor.entity';
import { IsEmail } from "class-validator";

@Entity()
export class Account {
  @Column()
  @Generated('increment')
  id: number;

  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Survivor, (survivor) => survivor.account)
  @JoinColumn()
  survivor: Survivor;
}
