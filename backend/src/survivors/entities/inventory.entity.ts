import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Survivor } from './survivor.entity';
import { Item } from './item.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  quantity: number;

  @OneToOne(() => Survivor, (survivor) => survivor.inventory)
  @JoinColumn()
  survivor: Survivor;

  @ManyToOne(() => Item, (items) => items)
  item: Item[];
}
