import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from './donations.service';

describe('ContributionService', () => {
  let service: DonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationService],
    }).compile();

    service = module.get<DonationService>(DonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
