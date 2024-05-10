import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DonationService } from './donations.service';
import { Prisma } from '@prisma/client';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@Body() createDonationDto: Prisma.DonationCreateInput) {
    return this.donationService.create(createDonationDto);
  }

  @Get()
  findAll() {
    return this.donationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationService.remove(+id);
  }
}
