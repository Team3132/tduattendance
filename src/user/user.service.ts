import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: userWhereUniqueInput });
  }

  updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({ where });
  }
}
