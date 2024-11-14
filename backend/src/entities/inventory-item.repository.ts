import { Repository } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

export class InventoryItemRepository extends Repository<InventoryItem> {}
