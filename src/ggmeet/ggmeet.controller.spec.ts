import { Test, TestingModule } from '@nestjs/testing';
import { GgmeetController } from './ggmeet.controller';

describe('GgmeetController', () => {
  let controller: GgmeetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GgmeetController],
    }).compile();

    controller = module.get<GgmeetController>(GgmeetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
