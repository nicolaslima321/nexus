import { Logger, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnprocessableEntityException } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { ExchangeDto } from 'src/inventory/dto/exchange.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { ItemDto } from 'src/inventory/dto/item.dto';
import { NexusAuthGuard } from 'src/auth/auth.guard';

@Controller('survivors')
export class SurvivorsController {
  private readonly logger = new Logger(SurvivorsController.name);

  constructor(
    private readonly survivorService: SurvivorsService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post()
  async createSurvivor(@Body() createSurvivorDto: CreateSurvivorDto) {
    this.logger.log('createSurvivor: starting survivor creation..');

    const { accessToken, survivor } = await this.survivorService.create(createSurvivorDto);

    this.logger.log(`createSurvivor: survivor #${survivor.id} and it's account were successfully created!`);

    return {
      message: 'Survivor successfully created!',
      accessToken,
      survivor,
    };
  }

  @Get()
  @UseGuards(NexusAuthGuard)
  async getAllSurvivors() {
    return await this.survivorService.findAll();
  }

  @Get('/reports')
  @UseGuards(NexusAuthGuard)
  async getReportsOfSurvivors() {
    this.logger.log('getReportsOfSurvivors: generating reports of survivors..');
    return await this.survivorService.generateReports();
  }

  @Get(':id')
  @UseGuards(NexusAuthGuard)
  async findSurvivorById(@Param('id') id: string) {
    this.logger.log(`findSurvivorById: searching for survivor #${id}`);

    const survivorFound = await this.survivorService.findOne(+id);

    if (!survivorFound)
      this.logger.error(`findSurvivorById: survivor #${id} not found!`);
    else
      this.logger.log(`findSurvivorById: survivor #${id} found!`);

    return survivorFound;
  }

  @Post('/:id/inventory/add')
  @UseGuards(NexusAuthGuard)
  async addOnInventory(@Param('id') id: string, @Body() addedItemDto: ItemDto) {
    const survivor = await this.survivorService.findWithInventory(+id);

    await this.inventoryService.addItemOnSurvivorInventory(addedItemDto, survivor);

    return {
      message: 'Items successfully added',
    };
  }

  @Post('/inventory/exchange')
  @UseGuards(NexusAuthGuard)
  async exchangeInventory(@Body() exchangeDto: ExchangeDto) {
    const { survivorId, requesterSurvivorId, itemToExchange } = exchangeDto;

    if (survivorId === requesterSurvivorId) {
      throw new UnprocessableEntityException('Cannot exchange items with yourself');
    }

    const survivor = await this.survivorService.findWithInventory(survivorId);
    const requesterSurvivor = await this.survivorService.findWithInventory(requesterSurvivorId);

    const exchangeReport = await this.inventoryService.exchangeSurvivorItem(survivor, requesterSurvivor, itemToExchange);

    return exchangeReport;
  }
}
