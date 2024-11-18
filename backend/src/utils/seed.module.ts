import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Item } from 'src/entities/item.entity';
import { Survivor } from 'src/entities/survivor.entity';
import { Inventory } from 'src/entities/inventory.entity';
import { InventoryItem } from 'src/entities/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Survivor, Inventory, InventoryItem])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
