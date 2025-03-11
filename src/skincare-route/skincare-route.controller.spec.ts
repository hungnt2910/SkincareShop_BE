import { Test, TestingModule } from '@nestjs/testing';
import { SkincareRouteController } from './skincare-route.controller';

describe('SkincareRouteController', () => {
  let controller: SkincareRouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkincareRouteController],
    }).compile();

    
    controller = module.get<SkincareRouteController>(SkincareRouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
