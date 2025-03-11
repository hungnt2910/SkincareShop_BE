import { Test, TestingModule } from '@nestjs/testing';
import { SkincareRouteService } from './skincare-route.service';

describe('SkincareRouteService', () => {
  let service: SkincareRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkincareRouteService],
    }).compile();

    service = module.get<SkincareRouteService>(SkincareRouteService);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
