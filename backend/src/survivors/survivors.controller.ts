import { Logger, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { ExchangeDto } from 'src/inventory/dto/exchange.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { ItemDto } from 'src/inventory/dto/item.dto';

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
    };
  }

  @Get()
  getAllSurvivors() {
    return this.survivorService.findAll();
  }

  @Get(':id')
  findSurvivorById(@Param('id') id: string) {
    return this.survivorService.findOne(+id);
  }

  @Patch(':id')
  updateSurvivor(@Param('id') id: string, @Body() updateSurvivorDto: UpdateSurvivorDto) {
    return this.survivorService.update(+id, updateSurvivorDto);
  }

  @Delete(':id')
  removeSurvivor(@Param('id') id: string) {
    return this.survivorService.remove(+id);
  }

  @Post('/:id/inventory/add')
  async addOnInventory(@Param('id') id: string, @Body() addedItemsDto: ItemDto[]) {
    const survivor = await this.survivorService.findWithInventory(+id);

    for (const addedItem of addedItemsDto) {
      await this.inventoryService.addItemOnSurvivorInventory(addedItem, survivor);
    }

    return {
      message: 'Items successfully added',
    };
  }

  @Post('/inventory/exchange')
  async exchangeInventory(@Body() exchangeDto: ExchangeDto) {
    console.log('exchangeDto');
    console.log(exchangeDto);

    const { survivorId, targetSurvivorId, itemsToExchange } = exchangeDto;

    const survivor = await this.survivorService.findWithInventory(survivorId);
    const targetSurvivor = await this.survivorService.findWithInventory(targetSurvivorId);

    const exchangeReport = await this.inventoryService.exchangeSurvivorItems(survivor, targetSurvivor, itemsToExchange);

    console.log('survivor');
    console.log(survivor);
    console.log('targetSurvivor');
    console.log(targetSurvivor);

    console.log('exchangeReport');
    console.log(exchangeReport);

    return exchangeReport;
  }

  @Get('/reports')
  getReportsOfSurvivors() {
    return {};
  }
}
