import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { genderEnum } from 'src/enums';

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

  @OneToOne(() => Inventory, (inventory) => inventory.survivor)
  @JoinColumn()
  inventory: Inventory;
}
