import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async seedItems() {
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
      console.log('Seed data inserted!');
    } else {
      console.log('Items already exist, skipping seed.');
    }
  }

  async onModuleInit() {
    await this.seedItems();
  }
}
