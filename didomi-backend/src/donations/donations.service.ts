import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DonationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDonationDto: Prisma.DonationCreateInput) {
    // Increment the number of donations in the project.
    await this.databaseService.project.update({
      where: {
        accountAddress: createDonationDto.accountAddress,
      },
      data: {
        totalDonations: { increment: 1 },
      },
    });
    return this.databaseService.donation.create({
      data: createDonationDto,
    });
  }

  findAll() {
    return this.databaseService.donation.findMany();
  }

  findOne(id: number) {
    return this.databaseService.donation.findUnique({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.donation.delete({ where: { id } });
  }
}
