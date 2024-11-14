import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { genderEnum } from 'src/enums';
import { Account } from './account.entity';

@Entity()
export class Survivor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('int')
  age: number;

  @Column({ type: 'enum', enum: genderEnum })
  gender: genderEnum;

  @Column('json')
  lastLocation: JSON;

  @Column('boolean')
  infected: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Account, (account) => account.survivor)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Inventory, (inventory) => inventory.survivor)
  @JoinColumn()
  inventory: Inventory;
}
