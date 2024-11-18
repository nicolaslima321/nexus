import { Logger, BadRequestException, InternalServerErrorException, NotFoundException, Injectable } from '@nestjs/common';
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
    const inventory = await this.inventoryRepository.create({
      survivor
    });

    survivor.inventory = inventory;

    await queryRunner.manager.save(Inventory, inventory);

    this.logger.log(`initializeSurvivorInventory: Survivor's (#${survivor.id}) inventory initialized!`);

    return inventory;
  }

  async addItemOnSurvivorInventory(itemDto: ItemDto, survivor: Survivor) {
    const { itemId, quantity } = itemDto;

    this.logger.log(`addItemOnSurvivorInventory: Adding item with ID ${itemId} to survivor's #${survivor.id} inventory...`);
    this.logger.log(`addItemOnSurvivorInventory: Checking if item with ID ${itemId} exists...`);

    const foundItem = await this.searchForItemId(itemId);

    if (foundItem) {
      const inventoryItem = await this.inventoryItemRepository.create({
        quantity,
        item: foundItem,
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

  async exchangeSurvivorItem(survivor: Survivor, requesterSurvivor: Survivor, itemsToExchange: ItemDto) {
    this.logger.log(`exchangeSurvivorItem: Exchanging items between survivor #${survivor.id} and survivor requester #${requesterSurvivor.id}`);

    this.logger.log(`exchangeSurvivorItem: Validating items to exchange...`);
    await this.validateExchangeItem(survivor.inventory, itemsToExchange);

    this.logger.log(`exchangeSurvivorItem: Performing exchange...`);
    const exchangeReportList = await this.performExchange(survivor.inventory, requesterSurvivor.inventory, itemsToExchange);

    this.logger.log(`exchangeSurvivorItem: Items exchanged successfully!`);

    this.logger.log(`exchangeSurvivorItem: Generating report...`);
    const exchangeReport = exchangeReportList.reduce((acc, curr, index) => {
      const separator = index === exchangeReportList.length - 1 ? '' : ', ';

      return acc + `${curr.item} (Quantity: ${curr.quantity})${separator}`;
    }, '');

    this.logger.log(`exchangeSurvivorItem: The following item was exchanged [${exchangeReport}]`);

    return exchangeReport;
  }

  async getAverageOfItemsPerSurvivor() {
    try {
      this.logger.log('getAverageOfItemsPerSurvivor: Getting average of items per survivor...');
      const result = await this.inventoryItemRepository
        .createQueryBuilder('inventoryItem')
        .select('inventoryItem.itemId', 'itemId')
        .addSelect('item.name', 'itemName')
        .addSelect('AVG(inventoryItem.quantity)', 'aeverageQuantityPerSurvivor')
        .innerJoin('inventoryItem.inventory', 'inventory')
        .innerJoin('inventory.survivor', 'survivor')
        .innerJoin('inventoryItem.item', 'item')
        .groupBy('inventoryItem.itemId')
        .addGroupBy('item.name')
        .getRawMany();

      const formattedResult = result.map(({ itemId, itemName, aeverageQuantityPerSurvivor }) => ({
        averageQuantityPerSurvivor: Math.round(Number(aeverageQuantityPerSurvivor)),
        itemName,
        itemId,
      }));

      return formattedResult;
    } catch (error) {
      this.logger.error('getAverageOfItemsPerSurvivor: Error while getting average of items per survivor!', error);

      throw new InternalServerErrorException('Error while getting average of items per survivor');
    }
  }

  private async validateExchangeItem(inventory: Inventory, itemToExchange: ItemDto) {
    this.logger.log('validateExchangeItem: The follow item was provided to exchange', itemToExchange);

    const existingItem = await this.itemRepository.findOneBy({ id: itemToExchange.itemId });

    if (!existingItem) {
      this.logger.error(`validateExchangeItem: The provided item, does not exists!`);

      throw new BadRequestException('The provided item, does not exists!');
    }

    this.logger.log('validateExchangeItem: The provided item exists, proceeding..', existingItem.id);
    const inventoryItem = inventory.inventoryItems.find(
      (invItem) => invItem.item.id === existingItem.id,
    );

    if (!inventoryItem || inventoryItem.quantity < itemToExchange.quantity) {
      this.logger.error(`validateExchangeItem: The item of ID ${itemToExchange.itemId} is not available on survivor's inventory, or there's no amount enough`);

      throw new BadRequestException(
        `The item of ID ${itemToExchange.itemId} is not available on survivor's inventory, or there's no amount enough`,
      );
    }

    this.logger.log('validateExchangeItem: The provided inventory exists, and is valid, proceeding..', inventoryItem);
  }

  private async performExchange(inventory: Inventory, requesterInventory: Inventory, itemToExchange: ItemDto) {
    this.logger.log('performExchange: Performing exchange...');
    const exchangedItemsReport = [];

    const inventoryItemToRemove = inventory.inventoryItems.find(
      (invItem) => Number(invItem.item.id) === Number(itemToExchange.itemId),
    );

    const inventoryItemToReceive = requesterInventory.inventoryItems.find(
      (invItem) => Number(invItem.item.id) === Number(itemToExchange.itemId),
    );

    this.logger.log('performExchange: Starting to perform exchange...');
    if (inventoryItemToRemove) {
      this.logger.log('performExchange: Survivor inventory is valid, proceeding...');

      this.logger.log('performExchange: Checking if requester inventory is valid...');
      if (!inventoryItemToReceive) {
        this.logger.log('performExchange: Requester inventory does not exists, creating one...');

        this.logger.log('performExchange: Initiating inventory with the exchanged item...');
        const itemToReceive = await this.itemRepository.findOneBy({ id: itemToExchange.itemId });

        const newInventoryItemToReceive = await this.inventoryItemRepository.create({
          quantity: itemToExchange.quantity,
          item: itemToReceive,
          inventory: requesterInventory,
        });

        inventoryItemToRemove.quantity -= itemToExchange.quantity;

        this.logger.log('performExchange: Updating both inventories...');
        await this.inventoryItemRepository.save(inventoryItemToRemove);

        await this.inventoryItemRepository.save(newInventoryItemToReceive);

        this.logger.log('performExchange: Items successfully exchanged! Generating simple report...');
        exchangedItemsReport.push({
          item: newInventoryItemToReceive.item.name,
          quantity: itemToExchange.quantity,
        });

        return exchangedItemsReport;
      } else {
        this.logger.log('performExchange: Requester inventory is okay...');
        inventoryItemToRemove.quantity -= itemToExchange.quantity;
        inventoryItemToReceive.quantity += itemToExchange.quantity;

        this.logger.log('performExchange: Updating both inventories...');
        await this.inventoryItemRepository.save(inventoryItemToRemove);
        await this.inventoryItemRepository.save(inventoryItemToReceive);

        this.logger.log('performExchange: Items successfully exchanged! Generating simple report...');
        exchangedItemsReport.push({
          item: inventoryItemToReceive.item.name,
          quantity: itemToExchange.quantity,
        });

        return exchangedItemsReport;
      }
    } else {
      this.logger.error('performExchange: Survivor inventory is not valid, exchange cannot be performed!');

      throw new BadRequestException('Survivor inventory is not valid, exchange cannot be performed!');
    }
  }

  private async searchForItemId(id: number) {
    return await this.itemRepository.findOneBy({ id });
  }
}
