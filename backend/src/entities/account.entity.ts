import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Survivor } from './survivor.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  login: string;

  @Column()
  password: string;

  @Column({ default: true })
  firstAccess: boolean;

  @OneToOne(() => Survivor, (account) => account.survivor)
  @JoinColumn()
  survivor: Survivor;
}
