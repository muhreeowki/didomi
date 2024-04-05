import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ContributionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createContributionDto: Prisma.ContributionCreateInput) {
    return this.databaseService.contribution.create({
      data: createContributionDto,
    });
  }

  findAll() {
    return this.databaseService.contribution.findMany();
  }

  findProjectContributions(projectId: number) {
    return this.databaseService.contribution.findMany({
      where: {
        projectId,
      },
    });
  }

  findOne(id: number) {
    return this.databaseService.contribution.findUnique({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.contribution.delete({ where: { id } });
  }
}
