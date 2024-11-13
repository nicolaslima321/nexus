import { Injectable } from '@nestjs/common';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survivor } from './entities/survivor.entity';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class SurvivorsService {
  constructor(
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createSurvivorDto: CreateSurvivorDto): Promise<Survivor> {
    const survivor = this.survivorRepository.create(createSurvivorDto);

    return await this.survivorRepository.save(survivor);
  }

  async findAll(): Promise<Survivor[]> {
    return await this.survivorRepository.find();
  }

  async findOne(id: number): Promise<Survivor> {
    return await this.survivorRepository.findOneBy({ id });
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

  async exchangeItems() {
    return {};
  }

  async generateReports() {
    return {};
  }
}
