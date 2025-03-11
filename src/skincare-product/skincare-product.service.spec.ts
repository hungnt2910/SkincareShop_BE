import { Test, TestingModule } from '@nestjs/testing';
import { SkincareProductService } from './skincare-product.service';

describe('SkincareProductService', () => {
  let service: SkincareProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkincareProductService],
    }).compile();

    service = module.get<SkincareProductService>(SkincareProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
