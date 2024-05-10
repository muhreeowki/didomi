import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { DonationModule } from './donations/donations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, ProjectsModule, DonationModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
