import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Survivor } from 'src/entities/survivor.entity';
import { Inventory } from 'src/entities/inventory.entity';
import { InventoryItem } from 'src/entities/inventory-item.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Survivor)
    private survivorRepository: Repository<Survivor>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async onModuleInit() {
    this.logger.log('onModuleInit: starting seed process..');
    await this.seedItems();

    if (process.env.NODE_ENV !== 'development') {
      await this.seedSurvivors();
    } else {
      this.logger.log('onModuleInit: productive environment, skiping remaining seeds..');
    }
  }

  private async seedItems() {
    const items = [
      { id: 1, description: 'Water', name: 'Water', },
      { id: 2, description: 'Food', name: 'Food', },
      { id: 3, description: 'Medication', name: 'Medication', },
      { id: 4, description: 'C-Virus Vaccine', name: 'C-Virus Vaccine', },
    ];

    const existingItems = await this.itemRepository.find();

    if (existingItems.length === 0) {
      for (const item of items) {
        const newItem = await this.itemRepository.create(item);
        await this.itemRepository.save(newItem);
      }
      this.logger.log('seedItems: Items data inserted!');
    } else {
      this.logger.log('seedItems: Items already exist, skipping seed.');
    }
  }

  private async seedSurvivors() {
    const recordsToCreate = 100;

    const existingSurvivors = await this.survivorRepository.find();

    if (existingSurvivors.length < 100) {
      for (let i = 0; i <= recordsToCreate; i++) {
        const randomItems = await this.itemRepository.find();

        const [latitude, longitude] = faker.location.nearbyGPSCoordinate();

        const lastLocation = { latitude, longitude };

        const survivor = this.survivorRepository.create({
          // @ts-expect-error
          gender: faker.datatype.boolean() ? 'male' : 'female',
          infected: faker.datatype.boolean(),
          name: faker.person.fullName(),
          age: faker.number.int({ min: 18, max: 70 }),
          createdAt: faker.date.recent({ days: 100 }),
          lastLocation: lastLocation,
        });

        await this.survivorRepository.save(survivor);

        const inventory = this.inventoryRepository.create({
          survivor,
        });

        survivor.inventory = inventory;

        await this.inventoryRepository.save(inventory);

        await this.survivorRepository.save(survivor);

        const hasItems = faker.datatype.boolean();

        if (hasItems) {
          const itemsCount = faker.number.int({ min: 1, max: 5 });

          for (let i = 0; i < itemsCount; i++) {
            const quantity = faker.number.int({ min: 1, max: 10 });
            const randomIndex = faker.number.int({ min: 0, max: 3 });

            const invItem = this.inventoryItemRepository.create({
              inventory,
              item: randomItems[randomIndex],
              quantity,
            });

            this.inventoryItemRepository.save(invItem);
          }
        }
      }

      this.logger.log('seedSurvivors: Items data inserted!');
    } else {
      this.logger.log('seedSurvivors: Survivors already exist, skipping seed.');
    }
  }
}
