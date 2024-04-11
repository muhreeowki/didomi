import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributionModule } from './contribution/contribution.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, ProjectsModule, ContributionModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
