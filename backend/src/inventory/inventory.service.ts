import { Logger, BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { Inventory } from 'src/entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from 'src/entities/survivor.entity';
import { Item } from 'src/entities/item.entity';
import { ItemDto } from './dto/item.dto';
import { InventoryItem } from 'src/entities/inventory-item.entity';
import { ExchangeDto } from './dto/exchange.dto';
import { QueryRunner } from 'typeorm';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

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

  async initializeSurvivorInventory(queryRunner: QueryRunner, survivor: Survivor) {
    const inventory = await this.inventoryRepository.create();

    await queryRunner.manager.save(Inventory, inventory);

    survivor.inventory = inventory;

    await queryRunner.manager.save(Survivor, survivor);

    this.logger.log(`initializeSurvivorInventory: Survivor's (#${survivor.id}) inventory initialized!`);

    return inventory;
  }

  async addItemOnSurvivorInventory(item: ItemDto, survivor: Survivor) {
    const { itemId } = item;

    this.logger.log(`addItemOnSurvivorInventory: Adding item with ID ${itemId} to survivor's #${survivor.id} inventory...`);
    this.logger.log(`addItemOnSurvivorInventory: Checking if item with ID ${itemId} exists...`);

    if (this.itemExists(itemId)) {
      const inventoryItem = await this.inventoryItemRepository.create({
        ...ItemDto,
        inventory: survivor.inventory,
      });

      await this.inventoryItemRepository.save(inventoryItem);
      this.logger.log(`addItemOnSurvivorInventory: Item with ID ${itemId} added to survivor's #${survivor.id} inventory!`);

      return inventoryItem;
    } else {
      this.logger.error(`addItemOnSurvivorInventory: Item with ID ${itemId} does not exists!`);

      throw new BadRequestException('Provided item to add on inventory does not exists!');
    }
  }

  async exchangeSurvivorItems(survivor: Survivor, targetSurvivor: Survivor, itemsToExchange: ItemDto[]) {
    this.logger.log(`exchangeSurvivorItems: Exchanging items between survivor #${survivor.id} and survivor #${targetSurvivor.id}`);

    this.logger.log(`exchangeSurvivorItems: Validating items to exchange...`);
    await this.validateExchangeItems(survivor.inventory, itemsToExchange);

    this.logger.log(`exchangeSurvivorItems: Performing exchange...`);
    const exchangeReportList = await this.performExchange(survivor.inventory, targetSurvivor.inventory, itemsToExchange);

    this.logger.log(`exchangeSurvivorItems: Items exchanged successfully!`);

    this.logger.log(`exchangeSurvivorItems: Generating report...`);
    const exchangeReport = exchangeReportList.reduce((acc, curr, index) => {
      const separator = index === exchangeReportList.length - 1 ? '' : ', ';

      return acc + `${curr.item} (Quantity: ${curr.quantity})${separator}`;
    }, '');

    this.logger.log(`exchangeSurvivorItems: The following items were exchanged [${exchangeReport}]`);

    return exchangeReport;
  }

  private async validateExchangeItems(inventory: Inventory, itemsToExchange: ItemDto[]) {
    const itemIds = itemsToExchange.map((item) => item.itemId);
    const existingItems = await this.itemRepository.findByIds(itemIds);

    if (existingItems.length !== itemIds.length) {
      this.logger.error(`validateExchangeItems: One or more items provided, does not exists!`);

      throw new BadRequestException('One or more items provided, does not exists!');
    }

    for (const exchangeItem of itemsToExchange) {
      const inventoryItem = inventory.inventoryItems.find(
        (invItem) => invItem.item.id === exchangeItem.itemId,
      );

      if (!inventoryItem || inventoryItem.quantity < exchangeItem.quantity) {
        this.logger.error(`validateExchangeItems: The item of ID ${exchangeItem.itemId} is not available on survivor's inventory, or there's no amount enough`);

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
