import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survivor } from '../entities/survivor.entity';
import { Repository } from 'typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/entities/account.entity';
import { DataSource, QueryRunner } from 'typeorm';

interface ISurvivorAccountCreationData {
  account: Account;
  accessToken: string;
  survivor: Survivor;
};

@Injectable()
export class SurvivorsService {
  private readonly logger = new Logger(SurvivorsService.name);

  constructor(
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
    private readonly inventoryService: InventoryService,
    private readonly accountService: AccountService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSurvivorDto: CreateSurvivorDto): Promise<ISurvivorAccountCreationData> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const survivor = this.survivorRepository.create(createSurvivorDto);

      await queryRunner.manager.save(Survivor, survivor);
      this.logger.log(`create: Survivor #${survivor.id} created!`);

      this.logger.log(`create: initializing survivor's (#${survivor.id}) inventory...`);
      await this.inventoryService.initializeSurvivorInventory(queryRunner, survivor);

      const accountData = await this.accountService.initializeSurvivorAccount(queryRunner, survivor, createSurvivorDto);

      await queryRunner.commitTransaction();

      return {
        survivor,
        ...accountData,
      };
    } catch (error) {
      this.logger.error(`create: Error while creating survivor, starting rollback of transactions...`, error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
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
