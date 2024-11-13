import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurvivorsModule } from './survivors/survivors.module';

import { Survivor } from './survivors/entities/survivor.entity';
import { Inventory } from './survivors/entities/inventory.entity';
import { Item } from './survivors/entities/item.entity';
import { SeedModule } from './utils/seed.module';

const databaseConnectionProps = {
  host: process?.env?.POSTGRES_HOST,
  port: parseInt(process?.env?.POSTGRES_PORT) || 5432,
  username: process?.env?.POSTGRES_USER,
  password: process?.env?.POSTGRES_PASSWORD,
  database: process?.env?.POSTGRES_DB,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...databaseConnectionProps,
      type: 'postgres',
      entities: [Survivor, Inventory, Item],
      synchronize: true,
    }),
    SeedModule,
    SurvivorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
