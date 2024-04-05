import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributionModule } from './contribution/contribution.module';

@Module({
  imports: [DatabaseModule, ProjectsModule, ContributionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
