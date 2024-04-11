import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':walletAddress')
  findOne(@Param('walletAddress') walletAddress: string) {
    return this.usersService.findOne(walletAddress);
  }

  @Patch(':walletAddress')
  update(
    @Param('walletAddress') walletAddress: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(walletAddress, updateUserDto);
  }

  @Delete(':walletAddress')
  remove(@Param('walletAddress') walletAddress: string) {
    return this.usersService.remove(walletAddress);
  }
}
