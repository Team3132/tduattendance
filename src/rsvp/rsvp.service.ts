import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, RSVPStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';

@Injectable()
export class RsvpService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(RsvpService.name);
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

  firstRSVP(rsvpWhereFirstInput: Prisma.RSVPWhereInput) {
    return this.prismaService.rSVP.findFirst({ where: rsvpWhereFirstInput });
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

  upsertRSVP(params: {
    where: Prisma.RSVPWhereUniqueInput;
    create: Prisma.RSVPCreateInput;
    update: Prisma.RSVPUpdateInput;
  }) {
    const { where, update, create } = params;
    return this.prismaService.rSVP.upsert({
      where,
      create,
      update,
    });
  }

  async scanin(params: { code: string; eventId: string }) {
    const { code, eventId } = params;
    const scancode = await this.prismaService.scancode.findUnique({
      where: {
        code,
      },
      include: {
        user: true,
      },
    });

    if (scancode) {
      const rsvp = await this.prismaService.rSVP.findFirst({
        where: {
          eventId,
          userId: scancode.userId,
        },
      });

      if (rsvp) {
        if (rsvp.status === RSVPStatus.ATTENDED) {
          throw new BadRequestException('User has already scanned in');
        } else {
          const rsvpUpdate = await this.prismaService.rSVP.update({
            where: {
              id: rsvp.id,
            },
            data: {
              status: RSVPStatus.ATTENDED,
              user: {
                connect: {
                  id: scancode.userId,
                },
              },
            },
          });
          return rsvpUpdate;
        }
      } else {
        const rsvpCreate = await this.prismaService.rSVP.create({
          data: {
            status: RSVPStatus.ATTENDED,
            user: {
              connect: {
                id: scancode.userId,
              },
            },
            event: {
              connect: {
                id: eventId,
              },
            },
          },
        });
        return rsvpCreate;
      }
    }
  }

  upsertManyRSVP(userId: string, eventIds: string[], status: RSVPStatus) {
    return Promise.all(
      eventIds.map(async (item) => {
        const existing = await this.prismaService.rSVP.findFirst({
          where: {
            eventId: item,
            userId,
          },
        });

        if (existing) {
          return this.prismaService.rSVP.update({
            where: { id: existing.id },
            data: {
              status,
            },
          });
        } else {
          return this.prismaService.rSVP.create({
            data: {
              event: {
                connect: {
                  id: item,
                },
              },
              user: {
                connect: {
                  id: userId,
                },
              },
              status,
            },
          });
        }
      }),
    );
  }
}
