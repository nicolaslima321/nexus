import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

export class InventoryRepository extends Repository<Inventory> {}
