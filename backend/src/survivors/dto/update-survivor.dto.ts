import { PartialType } from '@nestjs/mapped-types';
import { CreateSurvivorDto } from './create-survivor.dto';
import { Inventory } from '../entities/inventory.entity';

export class UpdateSurvivorDto extends PartialType(CreateSurvivorDto) {
  public infected: boolean;
  public inventory: Inventory;
}
