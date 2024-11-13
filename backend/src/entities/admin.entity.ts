import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;
}
