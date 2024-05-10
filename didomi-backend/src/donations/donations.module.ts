import { Module } from '@nestjs/common';
import { DonationService } from './donations.service';
import { DonationController } from './donations.controller';

@Module({
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
