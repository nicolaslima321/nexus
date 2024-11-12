import { Test, TestingModule } from '@nestjs/testing';
import { SurvivorsController } from './survivors.controller';
import { SurvivorsService } from './survivors.service';

describe('SurvivorsController', () => {
  let controller: SurvivorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurvivorsController],
      providers: [SurvivorsService],
    }).compile();

    controller = module.get<SurvivorsController>(SurvivorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
