import { Test, TestingModule } from '@nestjs/testing';
import { DonationController } from './donations.controller';
import { DonationService } from './donations.service';

describe('ContributionController', () => {
  let controller: DonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationController],
      providers: [DonationService],
    }).compile();

    controller = module.get<DonationController>(DonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
