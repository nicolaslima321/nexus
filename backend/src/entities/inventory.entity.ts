import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Survivor } from './survivor.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Survivor, (survivor) => survivor.inventory)
  @JoinColumn()
  survivor: Survivor;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.inventory)
  inventoryItems: InventoryItem[];
}
