import { Module } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { SurvivorsController } from './survivors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurvivorRepository } from '../entities/survivor.repository';
import { Survivor } from '../entities/survivor.entity';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../entities/item.repository';
import { Inventory } from '../entities/inventory.entity';
import { InventoryRepository } from '../entities/inventory.repository';
import { InventoryService } from 'src/inventory/inventory.service';
import { InventoryItem } from 'src/entities/inventory-item.entity';
import { InventoryItemRepository } from 'src/entities/inventory-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survivor,
      SurvivorRepository,
      Item,
      ItemRepository,
      Inventory,
      InventoryRepository,
      InventoryItem,
      InventoryItemRepository,
    ]),
  ],
  controllers: [SurvivorsController],
  providers: [SurvivorsService, InventoryService],
})
export class SurvivorsModule {}
