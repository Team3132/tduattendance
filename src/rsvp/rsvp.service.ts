import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';

@Injectable()
export class RsvpService {
  constructor(private readonly prismaService: PrismaService) {}

  createRSVP(data: Prisma.RSVPCreateInput) {
    return this.prismaService.rSVP.create({
      data,
    });
  }

  rsvps(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RSVPWhereUniqueInput;
    where?: Prisma.RSVPWhereInput;
    orderBy?: Prisma.RSVPOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.rSVP.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  rsvp(rsvpWhereUniqueInput: Prisma.RSVPWhereUniqueInput) {
    return this.prismaService.rSVP.findUnique({ where: rsvpWhereUniqueInput });
  }

  updateRSVP(params: {
    where: Prisma.RSVPWhereUniqueInput;
    data: Prisma.RSVPUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.rSVP.update({
      data,
      where,
    });
  }

  deleteRSVP(where: Prisma.RSVPWhereUniqueInput) {
    return this.prismaService.rSVP.delete({ where });
  }
}
