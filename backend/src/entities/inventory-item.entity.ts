import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Item } from './item.entity';

@Entity()
export class InventoryItem {
  @PrimaryColumn()
  id: number;

  @Column('int', { default: 0 })
  quantity: number;

  @ManyToOne(() => Inventory, inventory => inventory.inventoryItems)
  inventory: Inventory;

  @ManyToOne(() => Item)
  item: Item;
}
