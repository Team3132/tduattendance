import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';

@Injectable()
export class RsvpService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createRsvpDto: CreateRsvpDto) {
    return this.prismaService.rSVP.create({ data: createRsvpDto });
  }

  findAll() {
    return this.prismaService.rSVP.findMany();
  }

  findOne(id: string) {
    return this.prismaService.rSVP.findUnique({ where: { id } });
  }

  update(id: string, updateRsvpDto: UpdateRsvpDto) {
    return this.prismaService.rSVP.update({
      where: {
        id,
      },
      data: updateRsvpDto,
    });
  }

  remove(id: string) {
    return this.prismaService.rSVP.delete({ where: { id } });
  }
}
