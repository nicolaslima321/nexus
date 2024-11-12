import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';

@Controller('survivors')
export class SurvivorsController {
  constructor(private readonly survivorsService: SurvivorsService) {}

  @Post()
  create(@Body() createSurvivorDto: CreateSurvivorDto) {
    return this.survivorsService.create(createSurvivorDto);
  }

  @Get()
  findAll() {
    return this.survivorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.survivorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurvivorDto: UpdateSurvivorDto) {
    return this.survivorsService.update(+id, updateSurvivorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.survivorsService.remove(+id);
  }
}
