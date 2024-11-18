import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Item } from './item.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  quantity: number;

  @ManyToOne(() => Inventory, inventory => inventory.inventoryItems)
  @JoinColumn()
  inventory: Inventory;

  @ManyToOne(() => Item)
  item: Item;
}
