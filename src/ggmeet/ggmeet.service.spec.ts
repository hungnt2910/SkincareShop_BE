import { Test, TestingModule } from '@nestjs/testing';
import { GgmeetService } from './ggmeet.service';

describe('GgmeetService', () => {
  let service: GgmeetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GgmeetService],
    }).compile();

    service = module.get<GgmeetService>(GgmeetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
