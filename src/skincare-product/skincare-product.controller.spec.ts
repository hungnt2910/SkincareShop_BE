import { Test, TestingModule } from '@nestjs/testing';
import { SkincareProductController } from './skincare-product.controller';

describe('SkincareProductController', () => {
  let controller: SkincareProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkincareProductController],
    }).compile();

    controller = module.get<SkincareProductController>(SkincareProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
