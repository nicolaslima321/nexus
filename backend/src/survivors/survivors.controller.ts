import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';

@Controller('survivors')
export class SurvivorsController {
  constructor(private readonly survivorsService: SurvivorsService) {}

  @Post()
  createSurvivor(@Body() createSurvivorDto: CreateSurvivorDto) {
    return this.survivorsService.create(createSurvivorDto);
  }

  @Get()
  getAllSurvivors() {
    return this.survivorsService.findAll();
  }

  @Get(':id')
  findSurvivorById(@Param('id') id: string) {
    return this.survivorsService.findOne(+id);
  }

  @Patch(':id')
  updateSurvivor(@Param('id') id: string, @Body() updateSurvivorDto: UpdateSurvivorDto) {
    return this.survivorsService.update(+id, updateSurvivorDto);
  }

  @Delete(':id')
  removeSurvivor(@Param('id') id: string) {
    return this.survivorsService.remove(+id);
  }

  @Get('reports')
  getReportsOfSurvivors() {
    return {};
  }
}
