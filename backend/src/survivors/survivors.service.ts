import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survivor } from '../entities/survivor.entity';
import { Repository } from 'typeorm';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class SurvivorsService {
  constructor(
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
    private readonly inventoryService: InventoryService
  ) {}

  async create(createSurvivorDto: CreateSurvivorDto): Promise<Survivor> {
    const survivor = this.survivorRepository.create(createSurvivorDto);

    await this.survivorRepository.save(survivor);

    await this.inventoryService.initializeSurvivorInventory(survivor);

    return survivor;
  }

  async findAll(): Promise<Survivor[]> {
    return await this.survivorRepository.find();
  }

  async findOne(id: number): Promise<Survivor> {
    return await this.survivorRepository.findOneBy({ id });
  }

  async findWithInventory(survivorId: number) {
    const survivor = await this.survivorRepository.findOne({
      where: { id: survivorId },
      relations: ['inventory', 'inventory.inventoryItems', 'inventory.inventoryItems.item'],
    });

    if (!survivor) {
      throw new NotFoundException('Survivor does not exists!');
    }

    return survivor;
  }

  async update(id: number, updateSurvivorDto: UpdateSurvivorDto): Promise<void> {
    const survivor = await this.survivorRepository.findOneBy({ id });

    const updatedSurvivor = {
      ...survivor,
      ...updateSurvivorDto,
    }

    await this.survivorRepository.update(survivor, updatedSurvivor);
  }

  async remove(id: number): Promise<void> {
    await this.survivorRepository.delete(id);
  }

  async generateReports() {
    return {};
  }
}
