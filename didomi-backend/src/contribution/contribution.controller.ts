import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { Prisma } from '@prisma/client';

@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  create(@Body() createContributionDto: Prisma.ContributionCreateInput) {
    return this.contributionService.create(createContributionDto);
  }

  @Get()
  findAll() {
    return this.contributionService.findAll();
  }

  @Get('project/:projectId')
  findProjectContributions(@Param('projectId') projectId: string) {
    return this.contributionService.findProjectContributions(+projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionService.remove(+id);
  }
}
