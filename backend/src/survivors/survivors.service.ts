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
  account?: Account;
  accessToken?: string;
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

      let accountData = {};

      if (createSurvivorDto.skipAccountCreation) {
        this.logger.log(`create: Account creation was skipped, retrieving survivor only...`)
      } else {
        accountData = await this.accountService.initializeSurvivorAccount(queryRunner, survivor, createSurvivorDto);
      }

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
    return await this.survivorRepository.find({
      relations: ['inventory', 'inventory.inventoryItems', 'inventory.inventoryItems.item'],
    });
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
    this.logger.log('generateReports: starting to generate reports...');

    try {
      this.logger.log('generateReports: get statistics about survivors and its health status...');
      const statisticsAboutSurvivors = await this.getStatisticsAboutSurvivors();

      this.logger.log('generateReports: get amount of item per survivor...');
      const itemsPerSurvivorReport = await this.inventoryService.getAverageOfItemsPerSurvivor();

      this.logger.log(`generateReports: Reports generated, retrieving to controller...`);

      return {
        statisticsAboutSurvivors,
        itemsPerSurvivorReport,
      };
    } catch (error) {
      this.logger.error(`generateReports: Error while generating reports`, error);

      throw error;
    }
  }

  async getStatisticsAboutSurvivors() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    this.logger.error('oneMonthAgo');
    this.logger.error(oneMonthAgo);

    this.logger.error('oneMonthAgo.toISOString()');
    this.logger.error(oneMonthAgo.toISOString());

    const queryResult = await this.survivorRepository
      .createQueryBuilder('survivor')
      .select([
        'COUNT(*) AS "totalSurvivors"',
        'SUM(CASE WHEN survivor.infected = false THEN 1 ELSE 0 END) AS "totalOfHealthySurvivors"',
        'SUM(CASE WHEN survivor.infected = true THEN 1 ELSE 0 END) AS "totalOfInfectedSurvivors"',
        `(SELECT COUNT(*) FROM survivor AS s
          WHERE s.infected = false AND s."createdAt" > :oneMonthAgo) AS "recentlyHealthySurvivors"`,
        `(SELECT COUNT(*) FROM survivor AS s
          WHERE s.infected = true AND s."createdAt" > :oneMonthAgo) AS "recentlyInfectedSurvivors"`,
      ])
      .setParameter('oneMonthAgo', oneMonthAgo)
      .getRawOne();

    this.logger.log(`getStatisticsAboutSurvivors: Reports generated, processing data...`);
    const amountOfHealthyLastMonth = queryResult.recentlyHealthySurvivors || 0;
    const totalOfHealthySurvivors = queryResult.totalOfHealthySurvivors || 0;

    let healthyGrowthPercent;

    if (amountOfHealthyLastMonth > 0) {
      healthyGrowthPercent = ((amountOfHealthyLastMonth / (totalOfHealthySurvivors - amountOfHealthyLastMonth)) * 100).toFixed(2);
    }

    const amountOfInfectedLastMonth = queryResult.recentlyInfectedSurvivors || 0;
    const totalOfInfectedSurvivors = queryResult.totalOfInfectedSurvivors || 0;

    let infectedGrowthPercent;

    if (amountOfInfectedLastMonth > 0) {
      infectedGrowthPercent = ((amountOfInfectedLastMonth / (totalOfInfectedSurvivors - amountOfInfectedLastMonth)) * 100).toFixed(2);
    }

    return {
      totalSurvivors: Number(queryResult.totalSurvivors),
      totalOfHealthySurvivors: Number(totalOfHealthySurvivors),
      totalOfInfectedSurvivors: Number(totalOfInfectedSurvivors),
      recentlyInfected: Number(amountOfInfectedLastMonth),
      recentlyHealthy: Number(amountOfHealthyLastMonth),
      healthyGrowthPercent: Number(healthyGrowthPercent),
      infectedGrowthPercent: Number(infectedGrowthPercent),
    };
  }
}
