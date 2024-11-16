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
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/entities/account.entity';
import { AccountRepository } from 'src/entities/account.repository';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      AccountRepository,
      Survivor,
      SurvivorRepository,
      Item,
      ItemRepository,
      Inventory,
      InventoryRepository,
      InventoryItem,
      InventoryItemRepository,
    ]),
    JwtModule.register({
      global: true,
      secret: process?.env?.API_JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController, SurvivorsController],
  providers: [AuthService, AccountService, SurvivorsService, InventoryService],
})
export class SurvivorsModule {}
