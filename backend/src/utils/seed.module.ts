import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Item } from 'src/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
