import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createUserDto });
  }

  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(walletAddress: string) {
    return this.databaseService.user.findUnique({ where: { walletAddress } });
  }

  update(walletAddress: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { walletAddress },
      data: updateUserDto,
    });
  }

  remove(walletAddress: string) {
    return this.databaseService.user.delete({ where: { walletAddress } });
  }
}
