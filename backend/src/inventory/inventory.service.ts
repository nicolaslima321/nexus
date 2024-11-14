import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { Inventory } from 'src/entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from 'src/entities/survivor.entity';
import { Item } from 'src/entities/item.entity';
import { ItemDto } from './dto/item.dto';
import { InventoryItem } from 'src/entities/inventory-item.entity';
import { ExchangeDto } from './dto/exchange.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
  ) {}

  async initializeSurvivorInventory(survivor: Survivor) {
    const inventory = await this.inventoryRepository.create();

    await this.inventoryRepository.save(inventory);

    survivor.inventory = inventory;

    await this.survivorRepository.save(survivor);

    return inventory;
  }

  async addItemOnSurvivorInventory(item: ItemDto, survivor: Survivor) {
    const { itemId } = item;

    if (this.itemExists(itemId)) {
      const inventoryItem = await this.inventoryItemRepository.create({
        ...ItemDto,
        inventory: survivor.inventory,
      });

      await this.inventoryItemRepository.save(inventoryItem);

      return inventoryItem;
    } else {
      throw new BadRequestException('Provided item to add on inventory does not exists!');
    }
  }

  async exchangeSurvivorItems(survivor: Survivor, targetSurvivor: Survivor, itemsToExchange: ItemDto[]) {
    await this.validateExchangeItems(survivor.inventory, itemsToExchange);

    const exchangeReport = await this.performExchange(survivor.inventory, targetSurvivor.inventory, itemsToExchange);

    return exchangeReport;
  }

  private async validateExchangeItems(inventory: Inventory, itemsToExchange: ItemDto[]) {
    const itemIds = itemsToExchange.map((item) => item.itemId);
    const existingItems = await this.itemRepository.findByIds(itemIds);

    if (existingItems.length !== itemIds.length) {
      throw new BadRequestException('One or more items provided, does not exists!');
    }

    for (const exchangeItem of itemsToExchange) {
      const inventoryItem = inventory.inventoryItems.find(
        (invItem) => invItem.item.id === exchangeItem.itemId,
      );

      if (!inventoryItem || inventoryItem.quantity < exchangeItem.quantity) {
        throw new BadRequestException(
          `The item of ID ${exchangeItem.itemId} is not available on survivor's inventory, or there's no amount enough`,
        );
      }
    }
  }

  private async performExchange(inventory: Inventory, inventoryToReceive: Inventory, listOfItemsToExchange: ItemDto[]) {
    const exchangedItemsReport = [];

    for (const itemToExchange of listOfItemsToExchange) {
      const inventoryItemToRemove = inventory.inventoryItems.find(
        (invItem) => invItem.item.id === itemToExchange.itemId,
      );

      const inventoryItemToReceive = inventoryToReceive.inventoryItems.find(
        (invItem) => invItem.item.id === itemToExchange.itemId,
      );

      if (inventoryItemToRemove && inventoryItemToReceive) {
        inventoryItemToRemove.quantity -= itemToExchange.quantity;
        inventoryItemToReceive.quantity += itemToExchange.quantity;

        await this.inventoryItemRepository.save(inventoryItemToRemove);
        await this.inventoryItemRepository.save(inventoryItemToReceive);

        exchangedItemsReport.push({
          item: itemToExchange.name,
          quantity: itemToExchange.quantity,
        })
      }
    }

    return exchangedItemsReport;
  }

  private async itemExists(itemId: number) {
    const foundItem = await this.searchForItemId(itemId);

    return Boolean(foundItem);
  }

  private async searchForItemId(id: number) {
    return await this.itemRepository.findOneBy({ id });
  }
}
